import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import client from "../api/client";
import OddsChart from "../components/OddsChart";

function GameDetail() {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [odds, setOdds] = useState([]);

  useEffect(() => {
    client
      .get(`/games/${id}`)
      .then((res) => setGame(res.data))
      .catch((err) => console.error("Failed to fetch game:", err));

    client
      .get(`/odds/${id}`)
      .then((res) => setOdds(res.data))
      .catch((err) => console.error("Failed to fetch odds:", err));
  }, [id]);

  if (!game) {
    return <p className="text-gray-500">Loading game...</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">
        {game.away_team || "Away"} @ {game.home_team || "Home"}
      </h1>
      <p className="text-gray-400 mb-6">{game.game_date || "TBD"}</p>

      <div className="bg-gray-900 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Odds Movement</h2>
        {odds.length === 0 ? (
          <p className="text-gray-500">No odds data available yet.</p>
        ) : (
          <OddsChart data={odds} />
        )}
      </div>
    </div>
  );
}

export default GameDetail;
