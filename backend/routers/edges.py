from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models.game import Game
from models.odds_snapshot import OddsSnapshot
from models.prediction import Prediction

router = APIRouter(prefix="/edges", tags=["edges"])


@router.get("")
def get_edges(threshold: float = 0.05, db: Session = Depends(get_db)):
    games = db.query(Game).all()
    results = []

    for game in games:
        latest_odds = (
            db.query(OddsSnapshot)
            .filter(OddsSnapshot.game_id == game.game_id)
            .order_by(OddsSnapshot.timestamp.desc())
            .first()
        )
        latest_prediction = (
            db.query(Prediction)
            .filter(Prediction.game_id == game.game_id)
            .order_by(Prediction.timestamp.desc())
            .first()
        )

        if not latest_odds or not latest_prediction:
            continue

        edge = latest_prediction.model_home_prob - latest_odds.home_win_prob
        if abs(edge) > threshold:
            results.append({
                "game_id": game.game_id,
                "home_team": game.home_team,
                "away_team": game.away_team,
                "game_date": game.game_date.isoformat(),
                "status": game.status,
                "model_home_prob": latest_prediction.model_home_prob,
                "market_home_prob": latest_odds.home_win_prob,
                "edge": edge,
            })

    results.sort(key=lambda x: abs(x["edge"]), reverse=True)
    return results
