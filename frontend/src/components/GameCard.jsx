import { Link } from "react-router-dom";
import EdgeBadge from "./EdgeBadge";

function GameCard({ game }) {
  return (
    <Link
      to={`/game/${game.game_id}`}
      className="block bg-gray-900 rounded-lg p-5 hover:bg-gray-800 transition"
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="font-semibold">{game.away_team}</p>
          <p className="text-gray-400 text-sm">@</p>
          <p className="font-semibold">{game.home_team}</p>
        </div>
        {game.edge !== undefined && <EdgeBadge edge={game.edge} />}
      </div>
      <p className="text-gray-500 text-sm">{game.game_date}</p>
      {game.model_home_prob !== undefined && (
        <div className="mt-3 text-sm text-gray-400">
          <span>Model: {(game.model_home_prob * 100).toFixed(1)}%</span>
          {game.home_win_prob !== undefined && (
            <span className="ml-4">
              Market: {(game.home_win_prob * 100).toFixed(1)}%
            </span>
          )}
        </div>
      )}
    </Link>
  );
}

export default GameCard;
