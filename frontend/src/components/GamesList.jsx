import GameRow from "./GameRow";

const COLS = ["MATCHUP", "STATUS", "SCORE", "MARKET ODDS", "MODEL PROB", "EDGE"];

function SkeletonRow({ isAlt }) {
  return (
    <tr style={{ background: isAlt ? "#0a1018" : "#0d1421" }}>
      {COLS.map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div
            className="skeleton h-4 rounded"
            style={{ width: `${45 + (i * 13) % 40}%` }}
          />
        </td>
      ))}
    </tr>
  );
}

export default function GamesList({ games, edges, loading, onGameClick }) {
  const edgeMap = Object.fromEntries((edges || []).map((e) => [e.game_id, e]));

  return (
    <div className="flex-1 overflow-y-auto">
      <table className="w-full border-collapse">
        <thead
          style={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            background: "#080c14",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <tr>
            {COLS.map((col) => (
              <th key={col} className="px-4 py-3 text-left">
                <span
                  className="font-barlow text-xs tracking-widest"
                  style={{ color: "#334155" }}
                >
                  {col}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            [1, 2, 3, 4].map((i) => (
              <SkeletonRow key={i} isAlt={i % 2 === 0} />
            ))
          ) : games.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-4 py-12 text-center">
                <span className="font-dm text-sm" style={{ color: "#334155" }}>
                  No games scheduled today
                </span>
              </td>
            </tr>
          ) : (
            games.map((game, i) => (
              <GameRow
                key={game.game_id}
                game={game}
                edgeData={edgeMap[game.game_id]}
                onClick={() => onGameClick(game.game_id)}
                isAlt={i % 2 === 0}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
