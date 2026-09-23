export default function Meter({ label, value, cls }) {
  return (
    <div className="meter">
      <div className="meter-top"><span>{label}</span><b>{value}%</b></div>
      <div className="track"><div className={`fill ${cls}`} style={{ width: `${value}%` }} /></div>
    </div>
  );
}
