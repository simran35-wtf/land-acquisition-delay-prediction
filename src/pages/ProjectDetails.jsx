import RiskReport from "../components/RiskReport.jsx";

export default function ProjectDetails({ projects, id, onBack }) {
  const data = projects.find((p) => p.id === id) || projects[0];
  return <RiskReport data={data} onBack={onBack} backLabel="Back to Active Projects" />;
}
