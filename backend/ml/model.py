import pickle
from pathlib import Path

import pandas as pd
from sklearn.linear_model import LogisticRegression

MODEL_PATH = Path(__file__).parent / "trained_model.pkl"

# The model is intentionally kept as a simple logistic regression for now.
# Logistic regression outputs well-calibrated probabilities out of the box,
# which is critical for edge detection (we need accurate prob estimates,
# not just correct classifications). Upgrade to XGBoost in a future phase
# once we have enough data to justify the added complexity.


def train(df: pd.DataFrame) -> LogisticRegression:
    """Train a logistic regression model on the feature matrix.

    TODO: Split df into feature columns (home_win_pct, away_win_pct,
    home_rest_days, away_rest_days, is_home) and target (home_win).
    Fit a LogisticRegression, save to disk, and return the model.
    """
    model = LogisticRegression()
    # model.fit(X, y)
    # with open(MODEL_PATH, "wb") as f:
    #     pickle.dump(model, f)
    return model


def predict(df: pd.DataFrame) -> list[float]:
    """Load the trained model and predict home-win probabilities.

    TODO: Load model from MODEL_PATH, call predict_proba on the
    feature columns, and return a list of home-win probabilities.
    """
    # with open(MODEL_PATH, "rb") as f:
    #     model = pickle.load(f)
    # return model.predict_proba(X)[:, 1].tolist()
    return []
