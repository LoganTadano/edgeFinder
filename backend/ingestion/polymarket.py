BASE_URL = "https://clob.polymarket.com"


async def fetch_odds():
    """Fetch current NBA game win-market prices from Polymarket.

    Queries the Polymarket CLOB API for active NBA win markets.
    For each market, extracts the implied probability from the best
    bid/ask midpoint and maps it to a game_id.

    Returns a list of dicts with:
      - game_id (int)
      - home_win_prob (float, 0-1)
      - away_win_prob (float, 0-1)
      - source ("polymarket")

    TODO: Implement HTTP call to Polymarket API, match markets to
    games by team names, compute implied probabilities, and insert
    OddsSnapshot rows with the current timestamp.
    """
    pass
