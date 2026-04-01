from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String

from database import Base


class OddsSnapshot(Base):
    """Point-in-time snapshot of market odds for a game.

    The `timestamp` column is intentionally preserved so that every poll creates
    a new row rather than overwriting. This gives us a full time-series of
    market-implied probabilities for backtesting and charting odds movement.
    """

    __tablename__ = "odds_snapshots"

    snapshot_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    game_id = Column(Integer, ForeignKey("games.game_id"), nullable=False)
    timestamp = Column(DateTime, nullable=False)
    home_win_prob = Column(Float, nullable=False)
    away_win_prob = Column(Float, nullable=False)
    source = Column(String, nullable=False)
