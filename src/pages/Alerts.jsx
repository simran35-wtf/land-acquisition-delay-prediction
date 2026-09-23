import RiskBadge from "../components/RiskBadge.jsx";

export default function Alerts({ projects, openProject }) {
  const flagged = projects.filter((p) => p.risk === "High" || p.risk === "Medium");
  return (
    <>
      <h1 className="page-title">Alerts &amp; Early Warnings</h1>
      <p className="lead dark">Projects that have crossed into Medium or High risk — review these first.</p>

      {flagged.length === 0 && <p className="muted">No active warnings right now.</p>}
      <ul className="alert-list">
        {flagged.map((p) => (
          <li key={p.id} className={`alert-item ${p.risk.toLowerCase()}`}>
            <div>
              <div className="tl-title">{p.name}<span className="muted"> · {p.district}</span></div>
              <div className="muted">Delay probability {p.prob}% &nbsp;|&nbsp; {p.reasons?.[0]}</div>
            </div>
            <div className="alert-right">
              <RiskBadge level={p.risk} />
              <button className="btn ghost small" onClick={() => openProject(p.id)}>View</button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
