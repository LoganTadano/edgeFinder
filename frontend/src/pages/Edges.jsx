import { useEffect, useState } from "react";
import client from "../api/client";
import EdgeBadge from "../components/EdgeBadge";

function Edges() {
  const [edges, setEdges] = useState([]);

  useEffect(() => {
    client
      .get("/edges")
      .then((res) => setEdges(res.data))
      .catch((err) => console.error("Failed to fetch edges:", err));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edge Signals</h1>
      {edges.length === 0 ? (
        <p className="text-gray-500">No meaningful edges detected.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-gray-700">
              <tr>
                <th className="py-3 px-4">Game</th>
                <th className="py-3 px-4">Model Prob</th>
                <th className="py-3 px-4">Market Prob</th>
                <th className="py-3 px-4">Edge</th>
              </tr>
            </thead>
            <tbody>
              {edges.map((edge, i) => (
                <tr key={i} className="border-b border-gray-800">
                  <td className="py-3 px-4">
                    {edge.away_team} @ {edge.home_team}
                  </td>
                  <td className="py-3 px-4">
                    {(edge.model_home_prob * 100).toFixed(1)}%
                  </td>
                  <td className="py-3 px-4">
                    {(edge.home_win_prob * 100).toFixed(1)}%
                  </td>
                  <td className="py-3 px-4">
                    <EdgeBadge edge={edge.edge} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Edges;
