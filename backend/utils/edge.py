def calculate_edge(model_prob: float, market_prob: float) -> float:
    """Calculate the edge between model probability and market probability.

    A positive edge means the model thinks the outcome is more likely than
    the market implies — a potential value bet. A negative edge means the
    market is pricing the outcome higher than the model expects.

    Args:
        model_prob: Model-estimated probability (0-1).
        market_prob: Market-implied probability (0-1).

    Returns:
        Signed edge value (model_prob - market_prob).
    """
    return model_prob - market_prob
