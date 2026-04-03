import pickle
from pathlib import Path
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sqlalchemy.orm import Session
import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from features import build_feature_matrix


MODEL_PATH = Path(__file__).parent / "trained_model.pkl"
FEATURE_COLS = ["home_win_pct", "away_win_pct", "home_rest_days", "away_rest_days"]

# The model is intentionally kept as a simple logistic regression for now.
# Logistic regression outputs well-calibrated probabilities out of the box,
# which is critical for edge detection (we need accurate prob estimates,
# not just correct classifications). Upgrade to XGBoost in a future phase
# once we have enough data to justify the added complexity.


def train(db: Session) -> LogisticRegression:
    """Train a logistic regression model on the feature matrix."""
    df = build_feature_matrix(db)
    if df.empty:
        print("No training data available.")
        return None
    X = df[FEATURE_COLS]
    y = df["home_win"]
    model = LogisticRegression()
    model.fit(X, y)
    with open(MODEL_PATH, "wb") as f:
        pickle.dump(model, f)
    print(f"Model trained on {len(df)} games.")
    return model


def predict(df: pd.DataFrame) -> list[float]:
    """Load the trained model and predict home-win probabilities."""
    if not MODEL_PATH.exists():
        print("Model not trained yet.")
        return []
    X = df[FEATURE_COLS]
    with open(MODEL_PATH, "rb") as f:
        model = pickle.load(f)
    return model.predict_proba(X)[:, 1].tolist()


if __name__ == "__main__":
    from database import SessionLocal
    db = SessionLocal()
    try:
        model = train(db)
        if model:
            print("Coefficients:", model.coef_)
    finally:
        db.close()