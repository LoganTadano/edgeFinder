export default function StatusBadge({ status }) {
  const s = status?.toLowerCase();

  if (s === "in progress") {
    return (
      <span
        className="badge-live inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-dm font-semibold tracking-wide"
        style={{
          background: "rgba(179,255,0,0.12)",
          color: "#b3ff00",
          border: "1px solid rgba(179,255,0,0.25)",
        }}
      >
        <span
          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{ background: "#b3ff00" }}
        />
        LIVE
      </span>
    );
  }

  if (s === "final") {
    return (
      <span
        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-dm font-medium tracking-wide"
        style={{
          background: "rgba(255,255,255,0.04)",
          color: "#475569",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        FINAL
      </span>
    );
  }

  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-dm font-medium tracking-wide"
      style={{
        background: "rgba(100,116,139,0.12)",
        color: "#94a3b8",
        border: "1px solid rgba(100,116,139,0.2)",
      }}
    >
      SCHEDULED
    </span>
  );
}
