import { useState, useEffect, useCallback } from "react";
import { fetchGamesToday } from "../api";

export function useGames() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const load = useCallback(async () => {
    try {
      const data = await fetchGamesToday();
      setGames(data);
      setLastUpdated(Date.now());
      setError(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, 60000);
    return () => clearInterval(interval);
  }, [load]);

  return { games, loading, error, lastUpdated, retry: load };
}
