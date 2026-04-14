
import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from datetime import date, datetime
import pandas as pd
from sqlalchemy.orm import Session

from database import SessionLocal
from models.game import Game
from models.prediction import Prediction
from ml.model import predict, FEATURE_COLS


def get_current_team_stats(db: Session) -> dict:
      """Walk all completed games in date order and return the current
      rolling stats for every team: wins, games, last_date."""
      games = (
          db.query(Game)
          .filter(Game.status == "Final")
          .order_by(Game.game_date)
          .all()
      )

      team_stats = {}

      for game in games:
          for team in [game.home_team, game.away_team]:
              if team not in team_stats:
                  team_stats[team] = {"wins": 0, "games": 0, "last_date": None}

          home_won = game.home_score > game.away_score

          team_stats[game.home_team]["games"] += 1
          team_stats[game.home_team]["wins"] += 1 if home_won else 0
          team_stats[game.home_team]["last_date"] = game.game_date

          team_stats[game.away_team]["games"] += 1
          team_stats[game.away_team]["wins"] += 1 if not home_won else 0
          team_stats[game.away_team]["last_date"] = game.game_date

      return team_stats


def build_todays_features(db: Session, target_date: date = None) -> tuple[list[Game], pd.DataFrame]:
      """Return today's scheduled games and a matching feature DataFrame."""
      today = target_date or date.today()
      games = db.query(Game).filter(Game.game_date == today).all()

      if not games:
          return [], pd.DataFrame()

      team_stats = get_current_team_stats(db)

      rows = []
      for game in games:
          h = team_stats.get(game.home_team, {"wins": 0, "games": 0, "last_date": None})
          a = team_stats.get(game.away_team, {"wins": 0, "games": 0, "last_date": None})

          home_win_pct = h["wins"] / h["games"] if h["games"] > 0 else 0.5
          away_win_pct = a["wins"] / a["games"] if a["games"] > 0 else 0.5
          home_rest_days = (today - h["last_date"]).days if h["last_date"] else 7
          away_rest_days = (today - a["last_date"]).days if a["last_date"] else 7

          rows.append({
              "home_win_pct": home_win_pct,
              "away_win_pct": away_win_pct,
              "home_rest_days": home_rest_days,
              "away_rest_days": away_rest_days,
          })

      return games, pd.DataFrame(rows)

def run_predictions(db: Session = None, target_date: date = None):
      """Generate and store model predictions for today's games."""
      close_db = db is None
      if db is None:
          db = SessionLocal()

      try:
          games, df = build_todays_features(db, target_date=target_date)

          if df.empty:
              print("No games today to predict.")
              return

          home_probs = predict(df)

          if not home_probs:
              print("Model not trained yet — run ml/model.py first.")
              return

          for game, home_prob in zip(games, home_probs):
              away_prob = 1.0 - home_prob
              prediction = Prediction(
                  game_id=game.game_id,
                  timestamp=datetime.utcnow(),
                  model_home_prob=home_prob,
                  model_away_prob=away_prob,
                  edge=None,  # edge.py can compute this, or leave for the router
              )
              db.add(prediction)
              print(f"{game.away_team} @ {game.home_team}: home={home_prob:.3f} away={away_prob:.3f}")

          db.commit()
          print(f"Predictions written for {len(games)} games.")

      except Exception as e:
          db.rollback()
          print(f"Error running predictions: {e}")
      finally:
          if close_db:
              db.close()

if __name__ == "__main__":
    run_predictions()