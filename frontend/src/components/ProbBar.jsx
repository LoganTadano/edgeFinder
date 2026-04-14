function Bar({ homeTeam, awayTeam, homeProb, label, accentColor }) {
  const homePct = (homeProb * 100).toFixed(1);
  const awayPct = ((1 - homeProb) * 100).toFixed(1);

  return (
    <div className="mb-3">
      <div className="flex items-center justify-between mb-1.5">
        <span
          className="font-barlow text-xs tracking-widest uppercase"
          style={{ color: "#475569" }}
        >
          {label}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span
          className="font-barlow font-bold text-sm tabular-nums text-right"
          style={{ color: "#ff9500", minWidth: "3.5rem" }}
        >
          {awayPct}%
        </span>
        <div
          className="flex-1 rounded overflow-hidden"
          style={{ height: "18px", background: "rgba(255,255,255,0.04)" }}
        >
          <div className="h-full flex">
            <div
              className="h-full transition-all duration-500"
              style={{
                width: `${(1 - homeProb) * 100}%`,
                background: "rgba(255,149,0,0.45)",
              }}
            />
            <div
              className="h-full transition-all duration-500"
              style={{
                width: `${homeProb * 100}%`,
                background: accentColor === "ice"
                  ? "rgba(79,195,247,0.5)"
                  : "rgba(179,255,0,0.45)",
              }}
            />
          </div>
        </div>
        <span
          className="font-barlow font-bold text-sm tabular-nums"
          style={{
            color: accentColor === "ice" ? "#4fc3f7" : "#b3ff00",
            minWidth: "3.5rem",
          }}
        >
          {homePct}%
        </span>
      </div>
    </div>
  );
}

export default function ProbBar({ homeTeam, awayTeam, modelHomeProb, marketHomeProb }) {
  const hasEdge = modelHomeProb != null && marketHomeProb != null;
  const edge = hasEdge ? modelHomeProb - marketHomeProb : null;

  return (
    <div>
      {/* Team labels */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full" style={{ background: "#ff9500" }} />
          <span
            className="font-barlow font-bold text-xs uppercase tracking-wide"
            style={{ color: "#ff9500" }}
          >
            {awayTeam}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className="font-barlow font-bold text-xs uppercase tracking-wide"
            style={{ color: "#4fc3f7" }}
          >
            {homeTeam}
          </span>
          <span className="w-2 h-2 rounded-full" style={{ background: "#4fc3f7" }} />
        </div>
      </div>

      {modelHomeProb != null && (
        <Bar
          homeTeam={homeTeam}
          awayTeam={awayTeam}
          homeProb={modelHomeProb}
          label="Model"
          accentColor="ice"
        />
      )}

      {marketHomeProb != null && (
        <Bar
          homeTeam={homeTeam}
          awayTeam={awayTeam}
          homeProb={marketHomeProb}
          label="Market"
          accentColor="lime"
        />
      )}

      {hasEdge && (
        <div
          className="flex items-center justify-between mt-3 pt-3"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          <span
            className="font-barlow text-xs tracking-widest uppercase"
            style={{ color: "#334155" }}
          >
            Edge (Model − Market)
          </span>
          <span
            className="font-barlow font-bold text-xl tabular-nums"
            style={{ color: edge >= 0 ? "#b3ff00" : "#ff3b4e" }}
          >
            {edge >= 0 ? "+" : ""}{(edge * 100).toFixed(1)}%
          </span>
        </div>
      )}
    </div>
  );
}
