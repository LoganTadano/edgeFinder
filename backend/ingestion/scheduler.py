from apscheduler.schedulers.asyncio import AsyncIOScheduler

from ingestion.balldontlie import fetch_games
from ingestion.polymarket import fetch_odds

scheduler = AsyncIOScheduler()


def start_scheduler():
    """Start the APScheduler with a 15-minute ingestion interval.

    Runs fetch_games() and fetch_odds() every 15 minutes to keep
    the database current with today's games and live market odds.
    """
    scheduler.add_job(fetch_games, "interval", minutes=15, id="fetch_games")
    scheduler.add_job(fetch_odds, "interval", minutes=15, id="fetch_odds")
    scheduler.start()
