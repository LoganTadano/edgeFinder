function EdgeBadge({ edge }) {
  const pct = (edge * 100).toFixed(1);
  const isPositive = edge > 0;

  return (
    <span
      className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
        isPositive
          ? "bg-green-900 text-green-300"
          : "bg-red-900 text-red-300"
      }`}
    >
      {isPositive ? "+" : ""}
      {pct}%
    </span>
  );
}

export default EdgeBadge;
