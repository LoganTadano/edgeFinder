import { useState } from "react";
import Header from "./components/Header";
import EdgeAlertsPanel from "./components/EdgeAlertsPanel";
import GamesList from "./components/GamesList";
import GameDetailDrawer from "./components/GameDetailDrawer";
import { useGames } from "./hooks/useGames";
import { useEdges } from "./hooks/useEdges";

export default function App() {
  const [threshold, setThreshold] = useState(0.05);
  const [selectedGameId, setSelectedGameId] = useState(null);

  const {
    games,
    loading: gamesLoading,
    error: gamesError,
    lastUpdated,
    retry: retryGames,
  } = useGames();
  const {
    edges,
    loading: edgesLoading,
    error: edgesError,
    retry: retryEdges,
  } = useEdges(threshold);

  const hasError = gamesError || edgesError;

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background: "#080c14",
      }}
    >
      <Header lastUpdated={lastUpdated} />

      {hasError && (
        <div
          className="flex items-center justify-between px-6 py-2 flex-shrink-0"
          style={{
            background: "rgba(255,59,78,0.08)",
            borderBottom: "1px solid rgba(255,59,78,0.2)",
          }}
        >
          <span className="font-dm text-sm" style={{ color: "#ff3b4e" }}>
            ⚠ API connection failed — retrying...
          </span>
          <button
            onClick={() => {
              retryGames();
              retryEdges();
            }}
            className="font-barlow font-bold text-xs tracking-widest px-3 py-1 rounded"
            style={{
              background: "rgba(255,59,78,0.12)",
              color: "#ff3b4e",
              border: "1px solid rgba(255,59,78,0.25)",
              cursor: "pointer",
            }}
          >
            RETRY
          </button>
        </div>
      )}

      <EdgeAlertsPanel
        edges={edges}
        loading={edgesLoading}
        threshold={threshold}
        onThresholdChange={setThreshold}
      />

      <GamesList
        games={games}
        edges={edges}
        loading={gamesLoading}
        onGameClick={setSelectedGameId}
      />

      <GameDetailDrawer
        gameId={selectedGameId}
        onClose={() => setSelectedGameId(null)}
      />
    </div>
  );
}
