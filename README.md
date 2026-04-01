# EdgeFinder

NBA prediction market edge-detection app. Compares model-generated win probabilities against live market odds to surface betting edges.

## Stack

- **Backend:** Python, FastAPI, SQLAlchemy, PostgreSQL, APScheduler
- **Frontend:** React + Vite, Tailwind CSS, Recharts
- **Infrastructure:** Docker Compose

## Quick Start

```bash
cp .env.example .env
docker-compose up --build
```

Backend runs at `http://localhost:8000`. Frontend dev server at `http://localhost:5173`.

## Project Structure

```
edgefinder/
├── backend/       # FastAPI API, data ingestion, ML model
├── frontend/      # React SPA with dashboard, game detail, edges views
├── docker-compose.yml
└── .env.example
```

## API Endpoints

| Route              | Description                          |
|--------------------|--------------------------------------|
| GET /games/today   | Today's NBA games                    |
| GET /games/{id}    | Single game detail                   |
| GET /odds/{id}     | Odds history for a game              |
| GET /edges         | Games with meaningful model vs market edge |
