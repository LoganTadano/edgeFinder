import pandas as pd
from sqlalchemy.orm import Session


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
    return pd.DataFrame()
