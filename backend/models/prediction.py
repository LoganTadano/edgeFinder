from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer

from database import Base


class Prediction(Base):
    __tablename__ = "predictions"

    prediction_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    game_id = Column(Integer, ForeignKey("games.game_id"), nullable=False)
    timestamp = Column(DateTime, nullable=False)
    model_home_prob = Column(Float, nullable=False)
    model_away_prob = Column(Float, nullable=False)
    edge = Column(Float, nullable=True)
