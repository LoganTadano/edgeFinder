import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import time
import requests
from datetime import date
from sqlalchemy.orm import Session

from database import SessionLocal
from models.game import Game

API_KEY = os.getenv("BALLDONTLIE_API_KEY")
BASE_URL = "https://api.balldontlie.io/v1"

# Current NBA season — adjust end_date as needed
START_DATE = "2025-10-22"
END_DATE = date.today().isoformat()


def fetch_historical_games():
    db: Session = SessionLocal()
    inserted = 0
    skipped = 0
    cursor = None
    page_num = 1

    print(f"Fetching games from {START_DATE} to {END_DATE}...")

    try:
        while True:
            params = {
                "start_date": START_DATE,
                "end_date": END_DATE,
                "per_page": 100,
            }
            if cursor:
                params["cursor"] = cursor

            for attempt in range(3):
                response = requests.get(
                    f"{BASE_URL}/games",
                    headers={"Authorization": f"Bearer {API_KEY}"},
                    params=params,
                )
                if response.status_code == 429:
                    wait = 10 * (attempt + 1)
                    print(f"Rate limited, waiting {wait}s...")
                    time.sleep(wait)
                    continue
                response.raise_for_status()
                break
            data = response.json()
            games = data.get("data", [])

            if not games:
                break

            for game in games:
                # Only store completed games with scores
                if game["status"] != "Final":
                    skipped += 1
                    continue

                existing = db.query(Game).filter(Game.game_id == game["id"]).first()
                if existing:
                    skipped += 1
                    continue

                new_game = Game(
                    game_id=game["id"],
                    home_team=game["home_team"]["full_name"],
                    away_team=game["visitor_team"]["full_name"],
                    game_date=game["date"][:10],  # strip time component
                    home_score=game["home_team_score"],
                    away_score=game["visitor_team_score"],
                    status=game["status"],
                )
                db.add(new_game)
                inserted += 1

            db.commit()
            print(f"Page {page_num}: inserted {inserted} so far, skipped {skipped}")

            cursor = data.get("meta", {}).get("next_cursor")
            if not cursor:
                break

            page_num += 1
            time.sleep(2)  # stay under rate limit

    except Exception as e:
        db.rollback()
        print(f"Error: {e}")
    finally:
        db.close()

    print(f"\nDone. Total inserted: {inserted}, skipped: {skipped}")


if __name__ == "__main__":
    fetch_historical_games()
