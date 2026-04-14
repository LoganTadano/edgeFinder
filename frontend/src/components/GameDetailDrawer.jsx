import { useEffect } from "react";
import StatusBadge from "./StatusBadge";
import ProbBar from "./ProbBar";
import OddsChart from "./OddsChart";
import { useGameDetail } from "../hooks/useGameDetail";

export default function GameDetailDrawer({ gameId, onClose }) {
  const { detail, odds, loading } = useGameDetail(gameId);
  const isOpen = !!gameId;

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(4,7,14,0.75)",
          backdropFilter: "blur(3px)",
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
          transition: "opacity 0.3s ease",
          zIndex: 40,
        }}
      />

      {/* Drawer panel */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "420px",
          maxWidth: "100vw",
          background: "#0d1421",
          borderLeft: "1px solid rgba(255,255,255,0.07)",
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s ease",
          zIndex: 50,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Drawer header */}
        <div
          className="flex items-center justify-between px-5 py-4 flex-shrink-0"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <span
            className="font-barlow font-bold text-sm tracking-widest"
            style={{ color: "#334155" }}
          >
            GAME DETAIL
          </span>
          <button
            onClick={onClose}
            className="font-dm text-lg leading-none transition-colors"
            style={{
              color: "#334155",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px 8px",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#94a3b8")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#334155")}
          >
            ✕
          </button>
        </div>

        {/* Drawer body */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          {loading || !detail ? (
            <div>
              <div className="skeleton h-7 rounded mb-2" style={{ width: "60%" }} />
              <div className="skeleton h-4 rounded mb-1" style={{ width: "40%" }} />
              <div className="skeleton h-5 rounded mb-6" style={{ width: "30%" }} />
              <div className="skeleton h-28 rounded mb-4" />
              <div className="skeleton h-52 rounded" />
            </div>
          ) : (
            <>
              {/* Matchup header */}
              <div className="mb-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p
                      className="font-barlow font-bold text-2xl uppercase leading-tight text-white"
                      style={{ letterSpacing: "0.01em" }}
                    >
                      {detail.away_team.toUpperCase()}
                    </p>
                    <p
                      className="font-barlow text-sm tracking-widest"
                      style={{ color: "#475569" }}
                    >
                      @ {detail.home_team.toUpperCase()}
                    </p>
                  </div>
                  <StatusBadge status={detail.status} />
                </div>

                {detail.home_score != null && (
                  <div className="mt-3">
                    <span
                      className="font-barlow font-bold text-4xl tabular-nums text-white"
                    >
                      {detail.away_score}
                      <span style={{ color: "#334155", margin: "0 8px" }}>—</span>
                      {detail.home_score}
                    </span>
                    <p
                      className="font-barlow text-xs tracking-widest mt-0.5"
                      style={{ color: "#334155" }}
                    >
                      AWAY · HOME
                    </p>
                  </div>
                )}
              </div>

              {/* Prob bar section */}
              {detail.latest_prediction && (
                <div
                  className="mb-4 p-4 rounded"
                  style={{
                    background: "rgba(255,255,255,0.025)",
                    border: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <p
                    className="font-barlow text-xs tracking-widest mb-4"
                    style={{ color: "#334155" }}
                  >
                    PROBABILITY COMPARISON
                  </p>
                  <ProbBar
                    homeTeam={detail.home_team}
                    awayTeam={detail.away_team}
                    modelHomeProb={detail.latest_prediction?.model_home_prob}
                    marketHomeProb={detail.latest_odds?.home_win_prob}
                  />
                </div>
              )}

              {/* Odds chart section */}
              <div
                className="p-4 rounded"
                style={{
                  background: "rgba(255,255,255,0.025)",
                  border: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <p
                  className="font-barlow text-xs tracking-widest mb-3"
                  style={{ color: "#334155" }}
                >
                  MARKET ODDS HISTORY
                </p>
                <OddsChart odds={odds} />
                <div className="flex gap-4 mt-3">
                  <div className="flex items-center gap-1.5">
                    <div
                      className="rounded"
                      style={{ width: "12px", height: "2px", background: "#4fc3f7" }}
                    />
                    <span
                      className="font-dm text-xs"
                      style={{ color: "#475569" }}
                    >
                      Home
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div
                      className="rounded"
                      style={{ width: "12px", height: "2px", background: "#ff9500" }}
                    />
                    <span
                      className="font-dm text-xs"
                      style={{ color: "#475569" }}
                    >
                      Away
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
