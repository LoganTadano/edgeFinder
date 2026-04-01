from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models.odds_snapshot import OddsSnapshot

router = APIRouter(prefix="/odds", tags=["odds"])


@router.get("/{game_id}")
def get_odds_history(game_id: int, db: Session = Depends(get_db)):
    snapshots = (
        db.query(OddsSnapshot)
        .filter(OddsSnapshot.game_id == game_id)
        .order_by(OddsSnapshot.timestamp.asc())
        .all()
    )
    return [
        {
            "snapshot_id": s.snapshot_id,
            "timestamp": s.timestamp.isoformat(),
            "home_win_prob": s.home_win_prob,
            "away_win_prob": s.away_win_prob,
            "source": s.source,
        }
        for s in snapshots
    ]
