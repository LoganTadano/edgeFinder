import EdgeCard from "./EdgeCard";
import ThresholdSlider from "./ThresholdSlider";

function SkeletonCard() {
  return (
    <div
      className="skeleton rounded flex-shrink-0"
      style={{ width: "232px", minWidth: "232px", height: "188px" }}
    />
  );
}

export default function EdgeAlertsPanel({ edges, loading, threshold, onThresholdChange }) {
  return (
    <div
      className="flex-shrink-0 px-6 pt-4 pb-3"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
    >
      {/* Panel header */}
      <div className="flex items-center justify-between mb-3">
        <h2
          className="font-barlow font-bold text-lg tracking-widest"
          style={{ color: "#b3ff00" }}
        >
          ⚡ LIVE EDGES
        </h2>
        <ThresholdSlider value={threshold} onChange={onThresholdChange} />
      </div>

      {/* Cards row */}
      {loading ? (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {[1, 2, 3].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : edges.length === 0 ? (
        <div className="flex items-center justify-center py-5">
          <div className="text-center">
            <p
              className="font-barlow font-bold text-2xl mb-1"
              style={{ color: "#1e293b" }}
            >
              ◈
            </p>
            <p className="font-dm text-sm" style={{ color: "#334155" }}>
              No edges above threshold — market is efficient right now
            </p>
          </div>
        </div>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {edges.map((e) => (
            <EdgeCard key={e.game_id} edge={e} />
          ))}
        </div>
      )}
    </div>
  );
}
