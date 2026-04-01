from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db

router = APIRouter(prefix="/edges", tags=["edges"])


@router.get("")
def get_edges(threshold: float = 0.05, db: Session = Depends(get_db)):
    """Return games where abs(model_prob - market_prob) exceeds threshold.

    TODO: Join Prediction and OddsSnapshot on game_id, compare the latest
    model_home_prob against the latest home_win_prob. Filter to rows where
    abs(edge) > threshold. Return game info, model prob, market prob, and
    signed edge value.
    """
    return []
