from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine
from ingestion.scheduler import start_scheduler
from routers import edges, games, odds

# These imports must exist so SQLAlchemy registers the models with Base.metadata
from models import game, odds_snapshot, prediction

@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    # Auto-train model on startup if pkl is missing and training data exists
    from pathlib import Path
    if not Path("/app/ml/trained_model.pkl").exists():
        print("No trained model found — attempting auto-train...")
        from ml.model import train
        from database import SessionLocal
        db = SessionLocal()
        try:
            train(db)
        finally:
            db.close()
    start_scheduler()
    yield

app = FastAPI(title="EdgeFinder", version="0.1.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(games.router)
app.include_router(odds.router)
app.include_router(edges.router)


@app.get("/")
def root():
    return {"app": "EdgeFinder", "status": "running"}
