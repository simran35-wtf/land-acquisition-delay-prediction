import { useState } from "react";
import Field from "../components/Field.jsx";

// Stub sign-in — no real authentication, per the problem statement
// ("can be a stub for the hackathon — no real auth needed for a demo").
export default function Login({ onLogin }) {
  const [role, setRole] = useState("Project Officer");
  const [name, setName] = useState("");

  function submit(e) {
    e.preventDefault();
    onLogin({ role, name: name || "Project Officer" });
  }

  return (
    <div className="login-screen">
      <form className="login-card" onSubmit={submit}>
        <div className="mark">MoRD</div>
        <h1>Land Acquisition Delay Prediction System</h1>
        <p className="muted">Sign in to continue. No real authentication is needed for this demo.</p>

        <Field label="Full Name">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Priya Sharma" />
        </Field>
        <Field label="Role">
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option>Project Officer</option>
            <option>District Collector</option>
            <option>State Nodal Officer</option>
          </select>
        </Field>

        <button className="btn primary full" type="submit">Sign In</button>
        <p className="fineprint">Government official login — demo stub for the hackathon.</p>
      </form>
    </div>
  );
}
