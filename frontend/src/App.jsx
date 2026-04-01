import { Link, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Edges from "./pages/Edges";
import GameDetail from "./pages/GameDetail";

function App() {
  return (
    <div className="min-h-screen">
      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center gap-8">
        <span className="text-xl font-bold text-green-400">EdgeFinder</span>
        <Link to="/" className="text-gray-300 hover:text-white transition">
          Dashboard
        </Link>
        <Link
          to="/edges"
          className="text-gray-300 hover:text-white transition"
        >
          Edges
        </Link>
      </nav>

      <main className="p-6">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/game/:id" element={<GameDetail />} />
          <Route path="/edges" element={<Edges />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
