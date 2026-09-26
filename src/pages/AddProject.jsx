import { useEffect, useState } from "react";
import Field from "../components/Field.jsx";
import { createProject, getOptions } from "../api/index.js";
import { apiErrorMessage } from "../api/client.js";

const emptyForm = {
  name: "", district: "", state: "", projectType: "", landArea: "", acquired: "",
  landowners: "", approvalStage: "Environmental Clearance", disputes: "", pendingApprovals: "",
  compensationDelayDays: "", documentationIncomplete: false, rehabilitationStatus: "Pending",
  projectAgeDays: "", expectedDurationDays: "1095", remarks: "",
};

export default function AddProject({ onSubmitted }) {
  const [form, setForm] = useState(emptyForm);
  const [options, setOptions] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    getOptions()
      .then((data) => {
        if (cancelled) return;
        setOptions(data);
        setForm((prev) => ({
          ...prev,
          state: prev.state || data.states[0],
          district: prev.district || data.districts[0],
          projectType: prev.projectType || data.projectTypes[0],
        }));
      })
      .catch((e) => !cancelled && setError(apiErrorMessage(e)));
    return () => {
      cancelled = true;
    };
  }, []);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const setBool = (k) => (e) => setForm({ ...form, [k]: e.target.checked });

  async function submit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      // the ML model scores the project server-side and the API stores it
      const project = await createProject({
        name: form.name || "New Project",
        district: form.district,
        state: form.state,
        projectType: form.projectType,
        landArea: Number(form.landArea) || 0,
        acquired: Number(form.acquired) || 0,
        landowners: Number(form.landowners) || 0,
        approvalStage: form.approvalStage,
        disputes: Number(form.disputes) || 0,
        pendingApprovals: Number(form.pendingApprovals) || 0,
        compensationDelayDays: Number(form.compensationDelayDays) || 0,
        documentationIncomplete: form.documentationIncomplete,
        rehabilitationStatus: form.rehabilitationStatus,
        projectAgeDays: Number(form.projectAgeDays) || 0,
        expectedDurationDays: Number(form.expectedDurationDays) || 1095,
        remarks: form.remarks || null,
      });
      onSubmitted(project);
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <h1 className="page-title">Add New Project</h1>
      <p className="lead dark">Enter project details. The trained ML model scores delay risk on submit.</p>
      {error && <p className="api-banner">{error}</p>}
      <form className="form panel" onSubmit={submit}>
        <div className="form-grid">
          <Field label="Project Name">
            <input required value={form.name} onChange={set("name")} placeholder="e.g. Riverdale Bypass Road" />
          </Field>
          <Field label="State">
            <select required value={form.state} onChange={set("state")}>
              {(options?.states || []).map((s) => <option key={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="District">
            <select required value={form.district} onChange={set("district")}>
              {(options?.districts || []).map((d) => <option key={d}>{d}</option>)}
            </select>
          </Field>
          <Field label="Project Type">
            <select required value={form.projectType} onChange={set("projectType")}>
              {(options?.projectTypes || []).map((t) => <option key={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Total Land Required (hectares)">
            <input type="number" min="0" step="0.1" value={form.landArea} onChange={set("landArea")} placeholder="1200" />
          </Field>
          <Field label="Land Already Acquired (hectares)">
            <input type="number" min="0" step="0.1" value={form.acquired} onChange={set("acquired")} placeholder="680" />
          </Field>
          <Field label="Number of Landowners">
            <input type="number" min="0" value={form.landowners} onChange={set("landowners")} placeholder="130" />
          </Field>
          <Field label="Approval Stage">
            <select value={form.approvalStage} onChange={set("approvalStage")}>
              {(options?.approvalStages || [form.approvalStage]).map((s) => <option key={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Number of Active Disputes">
            <input type="number" min="0" value={form.disputes} onChange={set("disputes")} placeholder="0" />
          </Field>
          <Field label="Number of Pending Approvals">
            <input type="number" min="0" value={form.pendingApprovals} onChange={set("pendingApprovals")} placeholder="0" />
          </Field>
          <Field label="Compensation Delay (days)">
            <input type="number" min="0" value={form.compensationDelayDays} onChange={set("compensationDelayDays")} placeholder="0" />
          </Field>
          <Field label="Rehabilitation Status">
            <select value={form.rehabilitationStatus} onChange={set("rehabilitationStatus")}>
              {(options?.rehabilitationStatuses || [form.rehabilitationStatus]).map((s) => <option key={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Project Age (days)">
            <input type="number" min="0" value={form.projectAgeDays} onChange={set("projectAgeDays")} placeholder="365" />
          </Field>
          <Field label="Expected Duration (days)">
            <input type="number" min="1" value={form.expectedDurationDays} onChange={set("expectedDurationDays")} placeholder="1095" />
          </Field>
        </div>
        <label className="checkline">
          <input type="checkbox" checked={form.documentationIncomplete} onChange={setBool("documentationIncomplete")} />
          Land documentation is incomplete
        </label>
        <Field label="Remarks (optional)">
          <textarea rows="3" value={form.remarks} onChange={set("remarks")} placeholder="Local negotiations in progress..." />
        </Field>
        <button className="btn primary" type="submit" disabled={submitting}>
          {submitting ? "Predicting…" : "Submit & Predict Risk"}
        </button>
      </form>
    </>
  );
}
