import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import pandas as pd
from sqlalchemy.orm import Session
from models.game import Game


def build_feature_matrix(db: Session) -> pd.DataFrame:
    """Build a feature matrix from the database for model training.

    Features include:
      - home_win_pct: rolling win percentage for the home team
      - away_win_pct: rolling win percentage for the away team
      - home_rest_days: days since the home team last played
      - away_rest_days: days since the away team last played
      - is_home: always 1 (home-court indicator for symmetry)

    TODO: Query Game table for historical results, compute rolling
    stats per team, and return a DataFrame with one row per game
    and columns for each feature plus a binary target (home_win).
    """

    games = db.query(Game).filter(Game.status == "Final").order_by(Game.game_date).all()


    team_stats = {}  # team_name -> {"wins": 0, "games": 0, "last_date": None}
                                                                                                                                                          
    rows = []
                                                                                                                                                          
    for game in games:
      home = game.home_team
      away = game.away_team                                                                                                                               
   
      # Initialize team records if first time seeing them                                                                                                 
      if home not in team_stats:
          team_stats[home] = {"wins": 0, "games": 0, "last_date": None}                                                                                   
      if away not in team_stats:
          team_stats[away] = {"wins": 0, "games": 0, "last_date": None}                                                                                   
                                                                                                                                                          
      # --- Compute features BEFORE updating records ---
                                                                                                                                                          
      h = team_stats[home]
      a = team_stats[away]
                                                                                                                                                          
      home_win_pct = h["wins"] / h["games"] if h["games"] > 0 else 0.5
      away_win_pct = a["wins"] / a["games"] if a["games"] > 0 else 0.5                                                                                                                        
      home_rest_days = (game.game_date - h["last_date"]).days if h["last_date"] else 7      
      away_rest_days = (game.game_date - a["last_date"]).days if a["last_date"] else 7
                                                                                                                    
      if game.home_score > game.away_score:
          home_win = 1
      else:
          home_win = 0
      

      
      # 1 if game.home_score > game.away_score, else 0                                                                                         
                                                                                                                                                          
      rows.append({                                                                                                                                           
      "home_win_pct": home_win_pct,
      "away_win_pct": away_win_pct,
      "home_rest_days": home_rest_days,                                                                                                                   
      "away_rest_days": away_rest_days,
      "home_win": home_win,                                                                                                                               
      })    # all 5 features + home_win                                                                                                     
                                                                                                                                                          
      # --- Update records AFTER ---                                                                                                                      
      # increment wins/games for both teams, update last_date
       # --- Update records AFTER ---                                                                                                                    
      home_won = game.home_score > game.away_score
      team_stats[home]["games"] += 1                                                                                                                    
      team_stats[home]["wins"] += 1 if home_won else 0
      team_stats[home]["last_date"] = game.game_date                                                                                                    
                                                                                                                                                          
      team_stats[away]["games"] += 1
      team_stats[away]["wins"] += 1 if not home_won else 0                                                                                              
      team_stats[away]["last_date"] = game.game_date

    return pd.DataFrame(rows)

                                                                                                                                                        
if __name__ == "__main__":
      from database import SessionLocal
      db = SessionLocal()                                                                                                                                 
      try:
          df = build_feature_matrix(db)                                                                                                                   
          print(df)
          print(df.shape)
          print(df.describe())                                                                                                                            
      finally:
          db.close()     