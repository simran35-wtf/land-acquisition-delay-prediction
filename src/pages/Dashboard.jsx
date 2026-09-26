import { tone } from "../data/mockData.js";

export default function Dashboard({ go, counts, activity }) {
  const pct = (n) => (counts.total ? `${(n / counts.total) * 100}%` : "0%");
  return (
    <>
      <section className="hero">
        <div className="hero-text">
          <p className="date">Monday, 21 September 2026</p>
          <h1>Welcome, Project Officer!</h1>
          <p className="lead">Manage land acquisition projects, track progress and get AI-powered delay insights.</p>
          <div className="hero-actions">
            <button className="btn primary" onClick={() => go("Add New Project")}>Add New Project</button>
            <button className="btn ghost" onClick={() => go("Active Projects")}>Active Projects</button>
          </div>
        </div>

        <div className="hero-stat">
          <div className="big">{counts.total}</div>
          <div className="big-label">Total Active Projects</div>
          <div className="spread" role="img" aria-label="Risk split: 8 high, 10 medium, 6 low">
            <span className="seg high" style={{ width: pct(counts.high) }} />
            <span className="seg medium" style={{ width: pct(counts.medium) }} />
            <span className="seg low" style={{ width: pct(counts.low) }} />
          </div>
          <div className="legend">
            <span><i className="dot high" />{counts.high} High</span>
            <span><i className="dot medium" />{counts.medium} Medium</span>
            <span><i className="dot low" />{counts.low} Low</span>
          </div>
        </div>
      </section>

      <h2 className="section">Quick Overview</h2>
      <div className="counters">
        <div className="counter high"><b>{counts.high}</b><span>High Risk Projects</span></div>
        <div className="counter medium"><b>{counts.medium}</b><span>Medium Risk Projects</span></div>
        <div className="counter low"><b>{counts.low}</b><span>Low Risk Projects</span></div>
      </div>

      <h2 className="section">Recent Activity</h2>
      <ol className="timeline">
        {activity.slice(0, 4).map((a) => (
          <li key={a.time + a.project}>
            <i className={`node ${tone[a.status]}`} />
            <div className="tl-main">
              <div className="tl-title">{a.project}<span className="muted"> · {a.place}</span></div>
              <div>{a.text}</div>
              <div className="muted">{a.time}</div>
            </div>
            <span className={`pill ${tone[a.status]}`}>{a.status}</span>
          </li>
        ))}
      </ol>
    </>
  );
}
