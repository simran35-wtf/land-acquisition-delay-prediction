import { tone } from "../data/mockData.js";

export default function ProjectHistory({ activity }) {
  return (
    <>
      <h1 className="page-title">Project History</h1>
      <p className="lead dark">Full activity log across all land acquisition projects.</p>
      <ol className="timeline">
        {activity.map((a) => (
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
