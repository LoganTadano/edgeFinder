from datetime import date

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models.game import Game
from models.odds_snapshot import OddsSnapshot
from models.prediction import Prediction

router = APIRouter(prefix="/games", tags=["games"])


@router.get("/today")
def get_todays_games(db: Session = Depends(get_db)):
    games = db.query(Game).filter(Game.game_date == date.today()).all()
    return [
        {
            "game_id": g.game_id,
            "home_team": g.home_team,
            "away_team": g.away_team,
            "game_date": g.game_date.isoformat(),
            "home_score": g.home_score,
            "away_score": g.away_score,
            "status": g.status,
        }
        for g in games
    ]


@router.get("/{game_id}")
def get_game(game_id: int, db: Session = Depends(get_db)):
    game = db.query(Game).filter(Game.game_id == game_id).first()
    if not game:
        raise HTTPException(status_code=404, detail="Game not found")

    latest_odds = (
        db.query(OddsSnapshot)
        .filter(OddsSnapshot.game_id == game_id)
        .order_by(OddsSnapshot.timestamp.desc())
        .first()
    )

    latest_prediction = (
        db.query(Prediction)
        .filter(Prediction.game_id == game_id)
        .order_by(Prediction.timestamp.desc())
        .first()
    )

    return {
        "game_id": game.game_id,
        "home_team": game.home_team,
        "away_team": game.away_team,
        "game_date": game.game_date.isoformat(),
        "home_score": game.home_score,
        "away_score": game.away_score,
        "status": game.status,
        "latest_odds": {
            "home_win_prob": latest_odds.home_win_prob,
            "away_win_prob": latest_odds.away_win_prob,
            "source": latest_odds.source,
            "timestamp": latest_odds.timestamp.isoformat(),
        } if latest_odds else None,
        "latest_prediction": {
            "model_home_prob": latest_prediction.model_home_prob,
            "model_away_prob": latest_prediction.model_away_prob,
            "edge": latest_prediction.edge,
            "timestamp": latest_prediction.timestamp.isoformat(),
        } if latest_prediction else None,
    }
