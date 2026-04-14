import StatusBadge from "./StatusBadge";

function fmt(prob) {
  if (prob == null) return "—";
  return (prob * 100).toFixed(1) + "%";
}

function fmtEdge(edge) {
  if (edge == null) return null;
  const sign = edge >= 0 ? "+" : "";
  return sign + (edge * 100).toFixed(1) + "%";
}

export default function GameRow({ game, edgeData, onClick, isAlt }) {
  const edge = edgeData?.edge ?? null;
  const edgeStr = fmtEdge(edge);
  const edgeColor =
    edge === null ? "#334155" : edge >= 0 ? "#b3ff00" : "#ff3b4e";

  const score =
    game.home_score != null && game.away_score != null
      ? `${game.away_score} – ${game.home_score}`
      : "—";

  return (
    <tr
      onClick={onClick}
      className="cursor-pointer"
      style={{ background: isAlt ? "#0a1018" : "#0d1421" }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(79,195,247,0.04)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = isAlt ? "#0a1018" : "#0d1421")}
    >
      <td className="px-5 py-3">
        <span className="font-barlow font-bold text-sm uppercase text-white">
          {game.away_team.toUpperCase()}{" "}
          <span style={{ color: "#334155" }}>@</span>{" "}
          {game.home_team.toUpperCase()}
        </span>
      </td>
      <td className="px-4 py-3">
        <StatusBadge status={game.status} />
      </td>
      <td className="px-4 py-3">
        <span
          className="font-barlow text-sm tabular-nums"
          style={{ color: "#64748b" }}
        >
          {score}
        </span>
      </td>
      <td className="px-4 py-3">
        <span
          className="font-barlow text-sm tabular-nums"
          style={{ color: "#64748b" }}
        >
          {edgeData ? fmt(edgeData.home_win_prob) : "—"}
        </span>
      </td>
      <td className="px-4 py-3">
        <span
          className="font-barlow text-sm tabular-nums"
          style={{ color: "#4fc3f7" }}
        >
          {edgeData ? fmt(edgeData.model_home_prob) : "—"}
        </span>
      </td>
      <td className="px-4 py-3">
        <span
          className="font-barlow font-bold text-sm tabular-nums"
          style={{ color: edgeColor }}
        >
          {edgeStr || "—"}
        </span>
      </td>
    </tr>
  );
}
