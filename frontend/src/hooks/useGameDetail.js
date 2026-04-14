import { useState, useEffect } from "react";
import { fetchGameDetail, fetchOddsHistory } from "../api";

export function useGameDetail(gameId) {
  const [detail, setDetail] = useState(null);
  const [odds, setOdds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!gameId) {
      setDetail(null);
      setOdds([]);
      return;
    }
    setLoading(true);
    setError(null);
    Promise.all([fetchGameDetail(gameId), fetchOddsHistory(gameId)])
      .then(([detailData, oddsData]) => {
        setDetail(detailData);
        setOdds(oddsData);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [gameId]);

  return { detail, odds, loading, error };
}
