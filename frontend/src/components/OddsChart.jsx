import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

function formatTime(timestamp) {
  const d = new Date(timestamp);
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "#0d1421",
        border: "1px solid rgba(255,255,255,0.1)",
        padding: "8px 12px",
        borderRadius: "4px",
        fontFamily: "DM Sans, sans-serif",
      }}
    >
      <p style={{ color: "#475569", fontSize: "10px", marginBottom: "6px" }}>
        {label}
      </p>
      {payload.map((p) => (
        <p
          key={p.name}
          style={{
            color: p.color,
            fontSize: "14px",
            fontFamily: "Barlow Condensed, sans-serif",
            fontWeight: 700,
            marginBottom: "2px",
          }}
        >
          {p.name.toUpperCase()}: {(p.value * 100).toFixed(1)}%
        </p>
      ))}
    </div>
  );
}

export default function OddsChart({ odds }) {
  if (!odds || odds.length === 0) {
    return (
      <div
        className="flex items-center justify-center"
        style={{ height: "160px" }}
      >
        <span className="font-dm text-sm" style={{ color: "#1e293b" }}>
          No odds history available
        </span>
      </div>
    );
  }

  const data = odds.map((o) => ({
    time: formatTime(o.timestamp),
    home: o.home_win_prob,
    away: o.away_win_prob,
  }));

  return (
    <div style={{ width: "100%", height: 160 }}>
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
          <defs>
            <linearGradient id="homeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4fc3f7" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#4fc3f7" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="awayGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ff9500" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#ff9500" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.04)"
            horizontal
            vertical={false}
          />
          <XAxis
            dataKey="time"
            tick={{ fill: "#334155", fontSize: 10, fontFamily: "DM Sans" }}
            axisLine={{ stroke: "rgba(255,255,255,0.05)" }}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
            tick={{ fill: "#334155", fontSize: 10, fontFamily: "DM Sans" }}
            axisLine={false}
            tickLine={false}
            domain={[0.2, 0.8]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="home"
            name="home"
            stroke="#4fc3f7"
            strokeWidth={1.5}
            fill="url(#homeGrad)"
            dot={false}
            activeDot={{ r: 3, fill: "#4fc3f7" }}
          />
          <Area
            type="monotone"
            dataKey="away"
            name="away"
            stroke="#ff9500"
            strokeWidth={1.5}
            fill="url(#awayGrad)"
            dot={false}
            activeDot={{ r: 3, fill: "#ff9500" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
