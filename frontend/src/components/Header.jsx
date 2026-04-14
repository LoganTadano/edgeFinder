import { useState, useEffect } from "react";

function getSecondsAgo(ts) {
  if (!ts) return null;
  return Math.floor((Date.now() - ts) / 1000);
}

export default function Header({ lastUpdated }) {
  const [secondsAgo, setSecondsAgo] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsAgo(getSecondsAgo(lastUpdated));
    }, 1000);
    return () => clearInterval(interval);
  }, [lastUpdated]);

  const isLive = secondsAgo !== null && secondsAgo < 90;
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <header
      className="flex items-center justify-between px-6 flex-shrink-0"
      style={{
        height: "54px",
        background: "#0d1421",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Logo */}
      <div className="flex items-baseline gap-0.5">
        <span
          className="font-barlow font-extrabold text-3xl tracking-tight text-white"
          style={{ letterSpacing: "-0.01em" }}
        >
          EDGE
        </span>
        <span
          className="font-barlow font-extrabold text-3xl tracking-tight"
          style={{ color: "#b3ff00", letterSpacing: "-0.01em" }}
        >
          FINDER
        </span>
      </div>

      {/* Center label */}
      <div className="hidden sm:flex flex-col items-center">
        <span
          className="font-barlow font-bold text-sm tracking-widest"
          style={{ color: "#94a3b8" }}
        >
          NBA · TODAY
        </span>
        <span className="font-dm text-xs" style={{ color: "#334155" }}>
          {today}
        </span>
      </div>

      {/* Live indicator */}
      <div className="flex items-center gap-2">
        {secondsAgo !== null && (
          <span
            className="font-dm text-xs tabular-nums"
            style={{ color: "#334155" }}
          >
            Updated {secondsAgo}s ago
          </span>
        )}
        <div className="flex items-center gap-1.5">
          <span
            className={`w-2 h-2 rounded-full flex-shrink-0 ${isLive ? "pulse-dot" : ""}`}
            style={{
              background: isLive ? "#b3ff00" : "#1e293b",
              boxShadow: isLive ? "0 0 8px rgba(179,255,0,0.7)" : "none",
            }}
          />
          <span
            className="font-barlow font-bold text-sm tracking-widest"
            style={{ color: isLive ? "#b3ff00" : "#1e293b" }}
          >
            {isLive ? "LIVE" : "STALE"}
          </span>
        </div>
      </div>
    </header>
  );
}
