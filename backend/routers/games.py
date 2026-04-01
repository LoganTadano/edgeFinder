from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db

router = APIRouter(prefix="/games", tags=["games"])


@router.get("/today")
def get_todays_games(db: Session = Depends(get_db)):
    """Return all games scheduled for today.

    TODO: Query the Game table filtered by game_date == date.today().
    Return a list of game dicts with teams, status, and scores.
    """
    return []


@router.get("/{game_id}")
def get_game(game_id: int, db: Session = Depends(get_db)):
    """Return a single game by ID.

    TODO: Query Game by game_id. Include latest odds snapshot and
    prediction if available. Return 404 if not found.
    """
    return {}
