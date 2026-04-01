import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function OddsChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis dataKey="timestamp" stroke="#9CA3AF" tick={{ fontSize: 12 }} />
        <YAxis
          domain={[0, 1]}
          stroke="#9CA3AF"
          tick={{ fontSize: 12 }}
          tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
        />
        <Tooltip
          contentStyle={{ backgroundColor: "#1F2937", border: "none" }}
          labelStyle={{ color: "#9CA3AF" }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="home_win_prob"
          stroke="#34D399"
          name="Home Win %"
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="away_win_prob"
          stroke="#F87171"
          name="Away Win %"
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default OddsChart;
