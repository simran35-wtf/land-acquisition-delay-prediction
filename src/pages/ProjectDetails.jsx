import { useEffect, useState } from "react";
import RiskReport from "../components/RiskReport.jsx";
import { getProject } from "../api/index.js";
import { apiErrorMessage } from "../api/client.js";

export default function ProjectDetails({ id, onBack }) {
  const [project, setProject] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    getProject(id)
      .then((data) => !cancelled && setProject(data))
      .catch((e) => !cancelled && setError(apiErrorMessage(e)));
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (error) {
    return (
      <>
        <button className="linkback" onClick={onBack}>&larr; Back to Active Projects</button>
        <p className="api-banner">{error}</p>
      </>
    );
  }
  if (!project) return <p className="muted">Loading project…</p>;

  return <RiskReport data={project} onBack={onBack} backLabel="Back to Active Projects" />;
}
