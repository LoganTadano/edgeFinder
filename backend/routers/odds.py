from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db

router = APIRouter(prefix="/odds", tags=["odds"])


@router.get("/{game_id}")
def get_odds_history(game_id: int, db: Session = Depends(get_db)):
    """Return all odds snapshots for a game, ordered by timestamp.

    TODO: Query OddsSnapshot table filtered by game_id, ordered by
    timestamp ascending. Return a list of snapshot dicts with
    timestamp, home_win_prob, away_win_prob, and source.
    """
    return []
