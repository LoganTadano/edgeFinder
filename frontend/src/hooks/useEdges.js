import { useState, useEffect, useCallback } from "react";
import { fetchEdges } from "../api";

export function useEdges(threshold) {
  const [edges, setEdges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      const data = await fetchEdges(threshold);
      setEdges(data);
      setError(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [threshold]);

  useEffect(() => {
    setLoading(true);
    load();
    const interval = setInterval(load, 60000);
    return () => clearInterval(interval);
  }, [load]);

  return { edges, loading, error, retry: load };
}
