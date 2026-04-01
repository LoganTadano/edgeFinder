import os
import sys
sys.path.append("/app")
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import requests
from datetime import date, datetime
from sqlalchemy.orm import Session

from database import SessionLocal
from models.game import Game
from models.odds_snapshot import OddsSnapshot

API_KEY = os.getenv("KALSHI_API_KEY")
BASE_URL = "https://api.elections.kalshi.com/trade-api/v2"


def get_headers():
    return {"Authorization": f"Bearer {API_KEY}"}


async def fetch_odds():
    """Fetch NBA game win-market prices from Kalshi and insert OddsSnapshot rows.

    Flow:
      1. GET /events?series_ticker=KXNBAGAME&status=open — all upcoming NBA games
      2. For each event, GET /events/{ticker} — two markets (one per team) with prices
      3. Compute implied prob = (yes_bid_dollars + yes_ask_dollars) / 2
      4. Match to today's games in DB by city name substring (e.g. "Boston" in "Boston Celtics")
      5. Insert one OddsSnapshot per matched game
    """
    # Step 1: get all open NBA game events
    resp = requests.get(
        f"{BASE_URL}/events",
        headers=get_headers(),
        params={"series_ticker": "KXNBAGAME", "status": "open", "limit": 50},
    )
    resp.raise_for_status()
    events = resp.json().get("events", [])

    db: Session = SessionLocal()

    try:
        today_games = db.query(Game).filter(Game.game_date == date.today()).all()

        if not today_games:
            print("No games in DB for today, skipping Kalshi odds fetch.")
            return

        for event in events:
            event_ticker = event["event_ticker"]

            # Step 2: fetch the event to get market prices
            event_resp = requests.get(
                f"{BASE_URL}/events/{event_ticker}",
                headers=get_headers(),
            )
            event_resp.raise_for_status()
            markets = event_resp.json().get("markets", [])

            if len(markets) != 2:
                continue

            # Step 3: compute implied probability per team from bid/ask midpoint
            team_probs = {}
            for market in markets:
                city = market["yes_sub_title"]  # e.g. "Boston", "Miami"
                bid = float(market["yes_bid_dollars"])
                ask = float(market["yes_ask_dollars"])
                team_probs[city] = (bid + ask) / 2

            cities = list(team_probs.keys())
            if len(cities) != 2:
                continue

            # Step 4: match to a game in today's DB by city name substring
            matched_game = None
            for game in today_games:
                city_a, city_b = cities[0], cities[1]
                home_match_a = city_a in game.home_team and city_b in game.away_team
                home_match_b = city_b in game.home_team and city_a in game.away_team
                if home_match_a or home_match_b:
                    matched_game = game
                    break

            if not matched_game:
                print(f"No DB match for Kalshi event {event_ticker} ({cities})")
                continue

            # Assign home/away probs by checking which city matches home_team
            home_city = next(c for c in cities if c in matched_game.home_team)
            away_city = next(c for c in cities if c in matched_game.away_team)

            # Step 5: insert OddsSnapshot
            snapshot = OddsSnapshot(
                game_id=matched_game.game_id,
                timestamp=datetime.utcnow(),
                home_win_prob=team_probs[home_city],
                away_win_prob=team_probs[away_city],
                source="kalshi",
            )
            db.add(snapshot)
            print(f"Inserted odds for {matched_game.away_team} @ {matched_game.home_team}: "
                  f"home={team_probs[home_city]:.3f} away={team_probs[away_city]:.3f}")

        db.commit()
        print(f"Kalshi odds snapshot complete for {date.today()}")

    except Exception as e:
        db.rollback()
        print(f"Error fetching Kalshi odds: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    import asyncio
    asyncio.run(fetch_odds())
