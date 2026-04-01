from datetime import datetime

from apscheduler.schedulers.asyncio import AsyncIOScheduler

from ingestion.balldontlie import fetch_games
from ingestion.kalshi import fetch_odds

scheduler = AsyncIOScheduler()


def start_scheduler():
    """Start the APScheduler with a 15-minute ingestion interval.

    Runs fetch_games() and fetch_odds() every 15 minutes to keep
    the database current with today's games and live market odds.
    Both jobs fire immediately on startup via next_run_time=datetime.now().
    """
    scheduler.add_job(fetch_games, "interval", minutes=15, id="fetch_games", next_run_time=datetime.now())
    scheduler.add_job(fetch_odds, "interval", minutes=15, id="fetch_odds", next_run_time=datetime.now())
    scheduler.start()
