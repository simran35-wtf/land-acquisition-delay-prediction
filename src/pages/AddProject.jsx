import { useState } from "react";
import Field from "../components/Field.jsx";

export default function AddProject({ onSubmitted }) {
  const [form, setForm] = useState({
    name: "", district: "", landArea: "", landowners: "", approvalStage: "Environmental Clearance",
    disputes: "", pendingApprovals: "", remarks: "",
  });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  function submit(e) {
    e.preventDefault();
    // NOTE: this is a placeholder scoring formula for the frontend demo,
    // not the real ML model. Swap this block for a backend/API call once
    // the ML teammate's model is ready.
    const disputes = Number(form.disputes) || 0;
    const pending = Number(form.pendingApprovals) || 0;
    const owners = Number(form.landowners) || 0;
    let score = 10 + disputes * 8 + pending * 6 + Math.min(owners, 150) * 0.2;
    score = Math.max(4, Math.min(96, Math.round(score)));
    const risk = score >= 60 ? "High" : score >= 30 ? "Medium" : "Low";
    const reasons = [];
    if (disputes > 0) reasons.push(`${disputes} active dispute${disputes > 1 ? "s" : ""} reported`);
    if (pending > 0) reasons.push(`${pending} approval${pending > 1 ? "s" : ""} still pending`);
    if (owners > 80) reasons.push(`Large landowner base (${owners}) may slow consent`);
    if (reasons.length === 0) reasons.push("No major blockers reported at this stage");
    const actions = risk === "Low"
      ? ["Continue routine monitoring", "Keep project data updated"]
      : ["Prioritise pending approvals with the district office", "Set up a landowner meeting to address disputes", "Review again in 30 days"];

    onSubmitted({
      id: Date.now(),
      name: form.name || "New Project",
      district: form.district || "Not specified",
      risk, prob: score, progress: 0,
      landArea: Number(form.landArea) || 0, acquired: 0, landowners: owners,
      approvalStage: form.approvalStage, disputes, reasons, actions,
      history: [{ m: "Now", actual: 0, exp: 5 }],
    });
  }

  return (
    <>
      <h1 className="page-title">Add New Project</h1>
      <p className="lead dark">Enter project details. The AI model will score delay risk on submit.</p>
      <form className="form panel" onSubmit={submit}>
        <div className="form-grid">
          <Field label="Project Name">
            <input required value={form.name} onChange={set("name")} placeholder="e.g. Riverdale Bypass Road" />
          </Field>
          <Field label="District">
            <input required value={form.district} onChange={set("district")} placeholder="e.g. Sunpur District" />
          </Field>
          <Field label="Total Land Required (hectares)">
            <input type="number" min="0" value={form.landArea} onChange={set("landArea")} placeholder="1200" />
          </Field>
          <Field label="Number of Landowners">
            <input type="number" min="0" value={form.landowners} onChange={set("landowners")} placeholder="130" />
          </Field>
          <Field label="Approval Stage">
            <select value={form.approvalStage} onChange={set("approvalStage")}>
              <option>Environmental Clearance</option>
              <option>Compensation Disbursal</option>
              <option>Final Notification</option>
              <option>Handover</option>
            </select>
          </Field>
          <Field label="Number of Active Disputes">
            <input type="number" min="0" value={form.disputes} onChange={set("disputes")} placeholder="0" />
          </Field>
          <Field label="Number of Pending Approvals">
            <input type="number" min="0" value={form.pendingApprovals} onChange={set("pendingApprovals")} placeholder="0" />
          </Field>
        </div>
        <Field label="Remarks (optional)">
          <textarea rows="3" value={form.remarks} onChange={set("remarks")} placeholder="Local negotiations in progress..." />
        </Field>
        <button className="btn primary" type="submit">Submit &amp; Predict Risk</button>
      </form>
    </>
  );
}
