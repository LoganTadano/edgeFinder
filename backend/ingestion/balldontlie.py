import sys
import os
sys.path.append("/app") 
import requests
from datetime import date
from sqlalchemy.orm import Session
from database import SessionLocal
from models.game import Game


API_KEY = os.getenv("BALLDONTLIE_API_KEY")
BASE_URL = "https://api.balldontlie.io/v1"

async def fetch_games():
    """Fetch today's NBA games from the balldontlie API.

    Calls GET /v1/games?dates[]=<today> with the API key in the
    Authorization header. Returns a list of dicts with:
      - game_id (int)
      - home_team (str)
      - away_team (str)
      - game_date (date)
      - home_score (int | None)
      - away_score (int | None)
      - status (str)

    TODO: Implement HTTP call, parse response JSON, and upsert rows
    into the Game table via a database session.
    """
  
    today = date.today().isoformat()  # gives "2026-04-01"
    
    response = requests.get(
        f"{BASE_URL}/games",
        headers={"Authorization": f"Bearer {API_KEY}"},
        params={"dates[]": today}
    )
    data = response.json()

    #open database session
    db: Session = SessionLocal()

    try:
        for game in data["data"]:
            existing = db.query(Game).filter(Game.game_id == game["id"]).first()
            if existing:
                existing.home_score = game["home_team_score"]
                existing.away_score = game["visitor_team_score"]
                existing.status = game["status"]
            else:
                new_game = Game(
                    game_id=game["id"],
                    home_team=game["home_team"]["full_name"],
                    away_team=game["visitor_team"]["full_name"],
                    game_date=game["date"][:10],
                    home_score=game["home_team_score"],
                    away_score=game["visitor_team_score"],
                    status=game["status"],
                )
                db.add(new_game)
        db.commit()
        print(f"Successfully inserted games for {today}") 
    except Exception as e:
        db.rollback()  # undo everything if something goes wrong
        print(f"Error inserting games: {e}")
    finally:
        db.close()


    
if __name__ == "__main__":
      import asyncio
      result = asyncio.run(fetch_games())