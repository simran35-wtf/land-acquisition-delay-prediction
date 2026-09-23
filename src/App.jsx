import { useState } from "react";
import "./App.css";

import { initialProjects, initialActivity } from "./data/mockData.js";
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
  const [projects, setProjects] = useState(initialProjects);
  const [activity, setActivity] = useState(initialActivity);
  const [counts, setCounts] = useState({ total: 24, high: 8, medium: 10, low: 6 });

  function openProject(id) {
    setSelectedId(id);
    setPage("__detail");
  }

  function afterSubmit(result) {
    // add the new project to Active Projects
    setProjects((prev) => [result, ...prev]);

    // log it in Project History / Recent Activity
    setActivity((prev) => [
      {
        time: "Just now",
        project: result.name,
        place: result.district,
        text: "New project added",
        status: "In Progress",
      },
      ...prev,
    ]);

    // keep the dashboard counters in sync
    setCounts((prev) => ({
      total: prev.total + 1,
      high: prev.high + (result.risk === "High" ? 1 : 0),
      medium: prev.medium + (result.risk === "Medium" ? 1 : 0),
      low: prev.low + (result.risk === "Low" ? 1 : 0),
    }));

    setDraft(result);
    setPage("__result");
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
          <span className="bell" aria-label="3 alerts">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15zM10 21h4" /></svg>
            <i>3</i>
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
          {page === "Dashboard" && <Dashboard go={go} counts={counts} activity={activity} />}
          {page === "Active Projects" && <ActiveProjects projects={projects} openProject={openProject} />}
          {page === "Add New Project" && <AddProject onSubmitted={afterSubmit} />}
          {page === "Project History" && <ProjectHistory activity={activity} />}
          {page === "Alerts" && <Alerts projects={projects} openProject={openProject} />}
          {page === "Reports" && <Reports />}
          {page === "Help & Support" && <HelpSupport />}
          {page === "__detail" && <ProjectDetails projects={projects} id={selectedId} onBack={() => go("Active Projects")} />}
          {page === "__result" && draft && <RiskReport data={draft} onBack={() => go("Add New Project")} backLabel="Back to Add Project" />}
        </main>
      </div>
    </div>
  );
}
