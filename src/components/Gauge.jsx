export default function Gauge({ value, level }) {
  const angle = Math.min(100, Math.max(0, value)) * 3.6;
  const cls = level.toLowerCase();
  return (
    <div className="gauge-wrap">
      <div className={`gauge ${cls}`} style={{ background: `conic-gradient(var(--${cls === "medium" ? "medium" : cls}) ${angle}deg, #e8eeec 0deg)` }}>
        <div className="gauge-hole">
          <b>{value}%</b>
          <span>Delay chance</span>
        </div>
      </div>
    </div>
  );
}
