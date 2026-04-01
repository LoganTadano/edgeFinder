# EdgeFinder

A sports betting edge-detection tool that compares a machine learning model's win probabilities against live Kalshi odds to surface games where the market may be mispriced.

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
| ML Model | scikit-learn (logistic regression) |
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

---

## What's Coming Next

### Phase 2 — Kalshi Ingestion
- Implement `fetch_odds()` in `kalshi.py`
- Query the Kalshi API for active NBA win markets
- Map market slugs to `game_id` by team name matching
- Insert `OddsSnapshot` rows on each scheduler tick

### Phase 3 — ML Model
- Feature engineering from historical game data (home/away record, rest days, point differential)
- Train a logistic regression model in `ml/model.py`
- Run inference on today's games and write `Prediction` rows

### Phase 4 — Edge API
- Implement `GET /edges` to join predictions against latest odds snapshots
- Filter to games where `abs(model_home_prob - home_win_prob) > threshold`
- Return ranked list with team names, probabilities, and signed edge value

### Phase 5 — React Dashboard
- Vite + React + Tailwind CSS frontend
- Daily games list with live odds and model probabilities side-by-side
- Edge highlights and historical accuracy tracking
