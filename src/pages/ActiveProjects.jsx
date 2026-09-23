import { useState } from "react";
import RiskBadge from "../components/RiskBadge.jsx";
import Meter from "../components/Meter.jsx";

export default function ActiveProjects({ projects, openProject }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const filters = ["All", "High", "Medium", "Low"];

  const shown = projects.filter(
    (p) =>
      (filter === "All" || p.risk === filter) &&
      (p.name + p.district).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <h1 className="page-title">Active Projects</h1>
      <p className="lead dark">View and filter projects based on delay risk.</p>
      <div className="toolbar">
        <input
          className="search"
          placeholder="Search project, district or keyword..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="chips">
          {filters.map((f) => (
            <button key={f} className={filter === f ? "chip on" : "chip"} onClick={() => setFilter(f)}>
              {f === "All" ? `All (${projects.length})` : `${f} Risk`}
            </button>
          ))}
        </div>
      </div>

      {shown.length === 0 && <p className="muted">No projects match. Try a different search or filter.</p>}
      <div className="grid">
        {shown.map((p) => (
          <button key={p.id} className={`card clickable ${p.risk.toLowerCase()}`} onClick={() => openProject(p.id)}>
            <div className="card-head">
              <div>
                <h3>{p.name}</h3>
                <div className="muted">{p.district}</div>
              </div>
              <RiskBadge level={p.risk} />
            </div>
            <Meter label="Delay Probability" value={p.prob} cls={p.risk.toLowerCase()} />
            <Meter label="Progress" value={p.progress} cls="neutral" />
          </button>
        ))}
      </div>
    </>
  );
}
