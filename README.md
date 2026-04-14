# EdgeFinder

A full-stack sports betting edge-detection tool. It ingests live NBA game data and Kalshi market odds, runs a machine learning model to generate independent win probability estimates, and surfaces games where the model disagrees with the market — potential mispricings worth betting on.

The data pipeline, REST API, and React dashboard are production-ready. The ML model is a work in progress — currently a logistic regression baseline, actively being improved toward better probability calibration and real predictive edge. See [Model Performance & Roadmap](#model-performance--roadmap) below.

---

## What It Does

EdgeFinder ingests live NBA game data and market odds, runs a logistic regression model to generate independent win probability estimates, and exposes an API that flags games where the model disagrees with the market by more than a configurable threshold. The goal is to identify statistically significant edges — situations where the model believes a team is more likely to win than the market currently prices in.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend API | FastAPI (Python 3.11) |
| Database | PostgreSQL 15 |
| ORM | SQLAlchemy |
| ML Model | scikit-learn (logistic regression, in progress) |
| Data — Games | BallDontLie API (free NBA stats) |
| Data — Odds | Kalshi API |
| Task Scheduling | APScheduler (polls every 15 minutes) |
| Containerization | Docker + Docker Compose |
| Frontend (planned) | React + Vite + Tailwind CSS + Recharts |

---

## Folder Structure

```
edgeFinder/
├── docker-compose.yml
├── .env                        # Your local secrets (never commit this)
├── .env.example                # Template — copy this to .env
│
└── backend/
    ├── Dockerfile
    ├── requirements.txt
    ├── main.py                 # FastAPI app, lifespan, router registration
    ├── database.py             # SQLAlchemy engine, Base, session factory
    │
    ├── models/
    │   ├── __init__.py         # Imports all models so Base.metadata registers them
    │   ├── game.py             # Game table (game_id, teams, date, scores, status)
    │   ├── odds_snapshot.py    # Time-series market odds per game
    │   └── prediction.py       # Model output per game (home/away prob, edge)
    │
    ├── routers/
    │   ├── games.py            # GET /games/today, GET /games/{id}
    │   ├── odds.py             # GET /odds/{game_id}
    │   └── edges.py            # GET /edges?threshold=0.05
    │
    ├── ingestion/
    │   ├── balldontlie.py      # Fetches today's NBA games from BallDontLie API
    │   ├── kalshi.py           # Fetches live win-market odds from Kalshi
    │   └── scheduler.py        # APScheduler — runs ingestion every 15 minutes
    │
    ├── ml/
    │   ├── features.py         # Feature engineering from game/odds data
    │   └── model.py            # Logistic regression training and inference
    │
    └── utils/
        └── edge.py             # Edge calculation helpers
```

---

## Database Schema

**games**
| Column | Type | Notes |
|---|---|---|
| game_id | integer PK | BallDontLie game ID |
| home_team | string | |
| away_team | string | |
| game_date | date | |
| home_score | integer | Null until game completes |
| away_score | integer | Null until game completes |
| status | string | `scheduled`, `in progress`, `final` |

**odds_snapshots**
| Column | Type | Notes |
|---|---|---|
| snapshot_id | integer PK | Auto-increment |
| game_id | integer FK → games | |
| timestamp | datetime | When the snapshot was taken |
| home_win_prob | float | Market-implied probability (0–1) |
| away_win_prob | float | Market-implied probability (0–1) |
| source | string | e.g. `kalshi` |

**predictions**
| Column | Type | Notes |
|---|---|---|
| prediction_id | integer PK | Auto-increment |
| game_id | integer FK → games | |
| timestamp | datetime | When the model ran |
| model_home_prob | float | Model's estimated home win probability |
| model_away_prob | float | Model's estimated away win probability |
| edge | float | `model_home_prob - home_win_prob` |

---

## Running Locally

### Prerequisites
- Docker Desktop installed and running
- A free BallDontLie API key from [balldontlie.io](https://www.balldontlie.io)

### 1. Clone and configure environment

```bash
git clone <your-repo-url>
cd edgeFinder
cp .env.example .env
```

Open `.env` and fill in your values (see the Environment Variables section below).

### 2. Start everything

```bash
docker-compose up --build
```

This builds the backend image, starts Postgres, waits for the database health check to pass, then starts the FastAPI server. On first run, SQLAlchemy automatically creates all three tables.

- API: **http://localhost:8000**
- Interactive API docs: **http://localhost:8000/docs**

### 3. Verify the database

```bash
docker exec -it edgefinder-db-1 psql -U logan -d edgefinder
\dt
```

You should see `games`, `odds_snapshots`, and `predictions`.

### Stopping

```bash
docker-compose down
```

To also wipe the database volume (full reset):

```bash
docker-compose down -v
```

---

## Environment Variables

Copy `.env.example` to `.env` and fill in the values. Never commit `.env`.

```env
# Postgres credentials — used by both the Docker db service and the backend connection string
POSTGRES_USER=logan
POSTGRES_PASSWORD=edgefinder123
POSTGRES_DB=edgefinder

# SQLAlchemy connection string
# IMPORTANT: hostname must be 'db' (the Docker service name), not 'localhost'
DATABASE_URL=postgresql://logan:edgefinder123@db:5432/edgefinder

# BallDontLie API key — free account at balldontlie.io
BALLDONTLIE_API_KEY=your_key_here

# Frontend API base URL (used by Vite/React once the frontend is built)
VITE_API_URL=http://localhost:8000
```

---

## Running the Backend Without Docker

If you want to iterate on backend code without rebuilding the container, keep Postgres running in Docker and run FastAPI directly:

```bash
# Keep only the database running in Docker
docker-compose up db

# In a separate terminal
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux
pip install -r requirements.txt

# Override DATABASE_URL — use localhost instead of the Docker service name 'db'
export DATABASE_URL=postgresql://logan:edgefinder123@localhost:5432/edgefinder

uvicorn main:app --reload
```

---

## Testing an Ingestion File Directly

To iterate on `balldontlie.py` or `kalshi.py` without running the full app, add a `__main__` block and run the file directly:

```python
# at the bottom of balldontlie.py
if __name__ == "__main__":
    import asyncio
    result = asyncio.run(fetch_games())
    print(result)
```

```bash
cd backend
python ingestion/balldontlie.py
```

---

## API Endpoints

| Route | Description |
|---|---|
| `GET /` | Health check |
| `GET /games/today` | All games scheduled for today |
| `GET /games/{id}` | Single game with latest odds and prediction |
| `GET /odds/{game_id}` | Full odds history for a game |
| `GET /edges?threshold=0.05` | Games where model and market disagree by > threshold |

---

## Current Progress

### Phase 1 — Complete
- PostgreSQL schema designed and auto-created via SQLAlchemy `create_all()`
- FastAPI app running with lifespan context manager and APScheduler
- BallDontLie ingestion implemented — fetches today's NBA games and upserts into the `games` table
- 9 games successfully inserted into Postgres and verified
- Scheduler polling every 15 minutes

### Phase 2 — Complete
- `fetch_odds()` implemented in `kalshi.py`
- Queries Kalshi API for all open NBA win markets via `KXNBAGAME` series ticker
- Maps market slugs to `game_id` by city-name substring matching against today's DB games
- Inserts `OddsSnapshot` rows with home/away implied probabilities on each scheduler tick

### Phase 3 — Complete
- `build_feature_matrix()` implemented in `ml/features.py` — computes rolling win%, rest days per team from historical `games` table
- Logistic regression training and inference implemented in `ml/model.py` — serializes model to `trained_model.pkl`
- `seed_historical.py` added to backfill the full 2024–25 NBA season from BallDontLie

### Phase 4 — Complete
- `GET /edges` implemented in `routers/edges.py`
- Joins latest `Prediction` against latest `OddsSnapshot` per game
- Filters to `abs(model_home_prob - home_win_prob) > threshold` and returns ranked results

### Prediction Pipeline — Complete
- `ml/predict_today.py` added — builds feature rows for today's games using current-season rolling stats and writes `Prediction` rows to the DB
- `seed_historical.py` run successfully — 1,220 completed games from the 2025–26 season backfilled
- Logistic regression trained on 1,220 games, `trained_model.pkl` serialized to disk
- Scheduler updated to run `run_predictions()` every 15 minutes alongside `fetch_games` and `fetch_odds`
- Full pipeline verified end-to-end: 15 predictions written for April 12 slate
- Backend auto-trains model on startup if `trained_model.pkl` is missing

### Phase 5 — Complete
- Vite + React + Tailwind CSS frontend in `frontend/`
- "Sharp Sportsbook" aesthetic — dark terminal UI with Barlow Condensed + DM Sans fonts
- Live edges panel with threshold slider (debounced), edge cards with strong-edge glow
- Full games table with color-coded edge column and live/final/scheduled status badges
- Slide-in game detail drawer with probability bar and Recharts odds history chart
- Mock data fallback when API returns no games (e.g. off-season)
- Frontend added to `docker-compose.yml` — full stack launches with a single command

---

## Model Performance & Roadmap

> **Work in progress.** The model is a functional baseline — the goal is iterative improvement toward well-calibrated probabilities that genuinely disagree with the market on the right games.

### Current Model

- **Algorithm:** Logistic regression (scikit-learn)
- **Training data:** 1,220 completed NBA games from the 2025–26 regular season
- **Features:**
  - `home_win_pct` — rolling home team win percentage up to game date
  - `away_win_pct` — rolling away team win percentage up to game date
  - `home_rest_days` — days since home team last played
  - `away_rest_days` — days since away team last played
- **Learned coefficients:** `[+2.57, -2.56, +0.07, -0.04]`
  - Win percentage dominates, as expected. Rest days have small but logical directional effects.

Logistic regression was chosen intentionally for this baseline — it outputs well-calibrated probabilities out of the box, which matters more than raw accuracy for edge detection (a model that says 70% should win ~70% of the time).

### What's Next

- [ ] **Train/test split + evaluation metrics** — AUC-ROC and Brier score to quantify calibration
- [ ] **Additional features** — rolling point differential, strength of schedule, home/away splits, back-to-back flags
- [ ] **XGBoost** — once enough data justifies the added complexity and risk of overfitting
- [ ] **Opponent-adjusted stats** — account for who the team beat/lost to, not just win/loss record
- [ ] **Multi-season training data** — pull prior seasons via BallDontLie to increase training set size
- [ ] **Backtesting framework** — replay historical odds snapshots against model predictions to measure theoretical P&L

---

## Project Status

**All phases complete.** The full pipeline runs end-to-end:

```
BallDontLie API → games table
Kalshi API      → odds_snapshots table   } every 15 min via APScheduler
ML model        → predictions table
                     ↓
         GET /edges → React dashboard
```

### First-Time Setup

After cloning, seed the database and train the model before running Docker:

```bash
# 1. Start only the database
docker-compose up db

# 2. In a separate terminal — seed historical games and train
cd backend
python -m venv venv && venv\Scripts\activate
pip install -r requirements.txt
export DATABASE_URL=postgresql://logan:edgefinder123@localhost:5432/edgefinder
export BALLDONTLIE_API_KEY=your_key_here
python ingestion/seed_historical.py
python ml/model.py

# 3. Now bring up the full stack
docker-compose up --build
```

Frontend: **http://localhost:5173** · API: **http://localhost:8000** · Docs: **http://localhost:8000/docs**
