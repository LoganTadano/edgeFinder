import { useState, useEffect, useRef } from "react";

export default function ThresholdSlider({ value, onChange }) {
  const [local, setLocal] = useState(value);
  const timerRef = useRef(null);

  useEffect(() => {
    setLocal(value);
  }, [value]);

  function handleChange(e) {
    const v = parseFloat(e.target.value);
    setLocal(v);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => onChange(v), 300);
  }

  return (
    <div className="flex items-center gap-3">
      <span
        className="font-barlow text-xs tracking-widest uppercase"
        style={{ color: "#475569" }}
      >
        Min Edge
      </span>
      <input
        type="range"
        min="0.01"
        max="0.20"
        step="0.01"
        value={local}
        onChange={handleChange}
        className="threshold-slider w-28"
      />
      <span
        className="font-barlow font-bold text-base tabular-nums"
        style={{ color: "#b3ff00", minWidth: "3.5rem" }}
      >
        {(local * 100).toFixed(1)}%
      </span>
    </div>
  );
}
