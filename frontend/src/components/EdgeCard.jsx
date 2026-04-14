import StatusBadge from "./StatusBadge";

function fmt(prob) {
  return (prob * 100).toFixed(1) + "%";
}

function fmtEdge(edge) {
  const sign = edge >= 0 ? "+" : "";
  return sign + (edge * 100).toFixed(1) + "%";
}

function shortName(fullName) {
  const parts = fullName.split(" ");
  return parts[parts.length - 1].toUpperCase();
}

export default function EdgeCard({ edge }) {
  const isStrong = Math.abs(edge.edge) >= 0.15;
  const isPositive = edge.edge >= 0;
  const edgeColor = isPositive ? "#b3ff00" : "#ff3b4e";
  const modelHigher = edge.model_home_prob > edge.home_win_prob;

  return (
    <div
      className="edge-card relative rounded flex-shrink-0 p-4"
      style={{
        background: "#0d1421",
        border: `1px solid ${isStrong ? "rgba(179,255,0,0.3)" : "rgba(255,255,255,0.07)"}`,
        boxShadow: isStrong ? "0 0 24px rgba(179,255,0,0.12), inset 0 0 24px rgba(179,255,0,0.03)" : "none",
        width: "232px",
        minWidth: "232px",
      }}
    >
      {/* Strong edge badge */}
      {isStrong && (
        <div className="absolute top-2.5 right-2.5">
          <span
            className="font-barlow font-bold text-xs px-2 py-0.5 rounded"
            style={{
              background: "rgba(179,255,0,0.15)",
              color: "#b3ff00",
              border: "1px solid rgba(179,255,0,0.3)",
            }}
          >
            🔥 STRONG
          </span>
        </div>
      )}

      {/* Matchup */}
      <div className="mb-3" style={{ paddingRight: isStrong ? "72px" : "0" }}>
        <p
          className="font-barlow font-bold text-2xl leading-none uppercase text-white"
          style={{ letterSpacing: "0.01em" }}
        >
          {shortName(edge.away_team)}
        </p>
        <p
          className="font-barlow text-xs tracking-widest mt-0.5"
          style={{ color: "#475569" }}
        >
          @ {shortName(edge.home_team)}
        </p>
        <div className="mt-2">
          <StatusBadge status={edge.status} />
        </div>
      </div>

      {/* Probability comparison */}
      <div className="flex items-center justify-between mb-3">
        <div className="text-center">
          <p
            className="font-barlow text-xs tracking-widest mb-1"
            style={{ color: "#475569" }}
          >
            MODEL
          </p>
          <p
            className="font-barlow font-bold text-3xl tabular-nums"
            style={{ color: "#4fc3f7" }}
          >
            {fmt(edge.model_home_prob)}
          </p>
        </div>

        <div
          className="font-barlow font-bold text-xl"
          style={{ color: modelHigher ? "#b3ff00" : "#ff3b4e" }}
        >
          {modelHigher ? "→" : "←"}
        </div>

        <div className="text-center">
          <p
            className="font-barlow text-xs tracking-widest mb-1"
            style={{ color: "#475569" }}
          >
            MARKET
          </p>
          <p
            className="font-barlow font-bold text-3xl tabular-nums"
            style={{ color: "#64748b" }}
          >
            {fmt(edge.home_win_prob)}
          </p>
        </div>
      </div>

      {/* Edge value */}
      <div
        className="pt-3 flex items-baseline justify-between"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        <span
          className="font-barlow text-xs tracking-widest"
          style={{ color: "#334155" }}
        >
          EDGE
        </span>
        <span
          className="font-barlow font-bold text-2xl tabular-nums"
          style={{ color: edgeColor }}
        >
          {fmtEdge(edge.edge)}
        </span>
      </div>
    </div>
  );
}
