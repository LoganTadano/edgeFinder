import { mockGames, mockEdges, mockOdds, mockGameDetails } from "../mockData";

// With the Vite proxy configured, BASE_URL is empty (relative paths).
// Set VITE_API_URL in .env only if bypassing the proxy (e.g. production).
const BASE_URL = import.meta.env.VITE_API_URL || "";

export async function fetchGamesToday() {
  try {
    const res = await fetch(`${BASE_URL}/games/today`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data || data.length === 0) return mockGames;
    return data;
  } catch {
    return mockGames;
  }
}

export async function fetchEdges(threshold = 0.05) {
  try {
    const res = await fetch(`${BASE_URL}/edges?threshold=${threshold}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data || data.length === 0) {
      return mockEdges.filter((e) => Math.abs(e.edge) > threshold);
    }
    return data;
  } catch {
    return mockEdges.filter((e) => Math.abs(e.edge) > threshold);
  }
}

export async function fetchGameDetail(gameId) {
  try {
    const res = await fetch(`${BASE_URL}/games/${gameId}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  } catch {
    return mockGameDetails[gameId] || null;
  }
}

export async function fetchOddsHistory(gameId) {
  try {
    const res = await fetch(`${BASE_URL}/odds/${gameId}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data || data.length === 0) return mockOdds;
    return data;
  } catch {
    return mockOdds;
  }
}
