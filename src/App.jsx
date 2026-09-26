import { useCallback, useEffect, useState } from "react";
import "./App.css";

import { getActivity, getProjects, getStats } from "./api/index.js";
import { apiErrorMessage } from "./api/client.js";
import Icon from "./components/Icon.jsx";
import RiskReport from "./components/RiskReport.jsx";

import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ActiveProjects from "./pages/ActiveProjects.jsx";
import AddProject from "./pages/AddProject.jsx";
import ProjectDetails from "./pages/ProjectDetails.jsx";
import ProjectHistory from "./pages/ProjectHistory.jsx";
import Alerts from "./pages/Alerts.jsx";
import Reports from "./pages/Reports.jsx";
import HelpSupport from "./pages/HelpSupport.jsx";

const menu = ["Dashboard", "Active Projects", "Add New Project", "Project History", "Alerts", "Reports", "Help & Support"];

export default function App() {
  const [officer, setOfficer] = useState(null);
  const [page, setPage] = useState("Dashboard");
  const [selectedId, setSelectedId] = useState(null);
  const [draft, setDraft] = useState(null);
  const [projects, setProjects] = useState([]);
  const [activity, setActivity] = useState([]);
  const [counts, setCounts] = useState({ total: 0, high: 0, medium: 0, low: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [projectList, activityLog, stats] = await Promise.all([
        getProjects(),
        getActivity(),
        getStats(),
      ]);
      setProjects(projectList);
      setActivity(activityLog);
      setCounts(stats);
    } catch (e) {
      setError(apiErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (officer) load();
  }, [officer, load]);

  function openProject(id) {
    setSelectedId(id);
    setPage("__detail");
  }

  function afterSubmit(result) {
    // the backend already stored the project and logged the activity
    setDraft(result);
    setPage("__result");
    load();
  }

  function go(p) {
    setDraft(null);
    setSelectedId(null);
    setPage(p);
  }

  if (!officer) {
    return <Login onLogin={setOfficer} />;
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <div className="mark">MoRD</div>
          <div>
            <b>Land Acquisition Delay Prediction System</b>
            <div className="tag">Ministry of Rural Development, Government of India</div>
          </div>
        </div>
        <div className="user">
          <span className="bell" aria-label={`${counts.high} high risk alerts`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15zM10 21h4" /></svg>
            <i>{counts.high}</i>
          </span>
          <div className="who">
            <b>{officer.name}</b>
            <span>{officer.role}</span>
          </div>
          <div className="avatar">{officer.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()}</div>
        </div>
      </header>

      <div className="body">
        <nav className="rail" aria-label="Main">
          {menu.map((m) => (
            <button key={m} className={page === m ? "nav on" : "nav"} onClick={() => go(m)}>
              <Icon name={m} />
              <span>{m}</span>
            </button>
          ))}
          <p className="motto">Land for Progress, People for a Better Tomorrow</p>
        </nav>

        <main className="content">
          {error && (
            <div className="api-banner">
              <span>{error}</span>
              <button className="btn ghost small" onClick={load}>Retry</button>
            </div>
          )}
          {loading && <p className="muted">Loading data from the prediction API…</p>}

          {page === "Dashboard" && <Dashboard go={go} counts={counts} activity={activity} />}
          {page === "Active Projects" && <ActiveProjects projects={projects} openProject={openProject} />}
          {page === "Add New Project" && <AddProject onSubmitted={afterSubmit} />}
          {page === "Project History" && <ProjectHistory activity={activity} />}
          {page === "Alerts" && <Alerts projects={projects} openProject={openProject} />}
          {page === "Reports" && <Reports />}
          {page === "Help & Support" && <HelpSupport />}
          {page === "__detail" && <ProjectDetails key={selectedId} id={selectedId} onBack={() => go("Active Projects")} />}
          {page === "__result" && draft && <RiskReport data={draft} onBack={() => go("Add New Project")} backLabel="Back to Add Project" />}
        </main>
      </div>
    </div>
  );
}
