export default function HelpSupport() {
  return (
    <>
      <h1 className="page-title">Help &amp; Support</h1>
      <p className="lead dark">Common questions about the prediction system.</p>
      <section className="panel">
        <details open><summary>How is the delay risk calculated?</summary><p className="muted">The AI/ML model looks at land area, number of landowners, approval stage and active disputes to estimate a delay probability.</p></details>
        <details><summary>How often should I update a project?</summary><p className="muted">Update details whenever approvals, disputes or land acquired changes, so predictions stay accurate.</p></details>
        <details><summary>Who do I contact for technical issues?</summary><p className="muted">Reach the project support desk at support@mord.gov.in.</p></details>
      </section>
    </>
  );
}
