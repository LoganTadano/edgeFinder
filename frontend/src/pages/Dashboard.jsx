import { useEffect, useState } from "react";
import client from "../api/client";
import GameCard from "../components/GameCard";

function Dashboard() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    client
      .get("/games/today")
      .then((res) => setGames(res.data))
      .catch((err) => console.error("Failed to fetch games:", err));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Today's Games</h1>
      {games.length === 0 ? (
        <p className="text-gray-500">No games found for today.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {games.map((game) => (
            <GameCard key={game.game_id} game={game} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
