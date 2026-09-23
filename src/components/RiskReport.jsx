import RiskBadge from "./RiskBadge.jsx";
import Gauge from "./Gauge.jsx";

// Used by both the Project Details page and the result shown after
// submitting Add New Project.
export default function RiskReport({ data, onBack, backLabel }) {
  return (
    <>
      <button className="linkback" onClick={onBack}>&larr; {backLabel}</button>
      <div className="detail-head">
        <div>
          <h1 className="page-title">{data.name}</h1>
          <p className="muted">{data.district}</p>
        </div>
        <RiskBadge level={data.risk} />
      </div>

      <div className="report-grid">
        <section className="panel">
          <h2>Prediction Result</h2>
          <Gauge value={data.prob} level={data.risk} />
        </section>

        <section className="panel">
          <h2>Major Reasons for Delay</h2>
          <ol className="reasons">
            {data.reasons.map((r) => <li key={r}>{r}</li>)}
          </ol>
        </section>

        <section className="panel">
          <h2>Suggested Actions</h2>
          <ul className="actions">
            {data.actions.map((a) => <li key={a}>{a}</li>)}
          </ul>
        </section>

        {data.history && (
          <section className="panel span2">
            <h2>Progress Over Time</h2>
            <div className="chart">
              {data.history.map((h) => (
                <div key={h.m} className="chart-col">
                  <div className="bars">
                    <div className="bar exp" style={{ height: `${h.exp}%` }} title={`Expected ${h.exp}%`} />
                    <div className="bar actual" style={{ height: `${h.actual}%` }} title={`Actual ${h.actual}%`} />
                  </div>
                  <span className="muted">{h.m}</span>
                </div>
              ))}
            </div>
            <div className="chart-legend">
              <span><i className="sw actual" />Actual progress</span>
              <span><i className="sw exp" />Expected progress</span>
            </div>
          </section>
        )}

        {typeof data.landArea === "number" && (
          <section className="panel span2">
            <h2>Project Facts</h2>
            <div className="facts">
              <div><b>{data.landArea} ha</b><span>Total land required</span></div>
              <div><b>{data.acquired} ha</b><span>Land acquired</span></div>
              <div><b>{data.landowners}</b><span>Landowners</span></div>
              <div><b>{data.approvalStage}</b><span>Approval stage</span></div>
              <div><b>{data.disputes}</b><span>Active disputes</span></div>
            </div>
          </section>
        )}
      </div>
      <p className="fineprint">AI prediction is based on current data and historical patterns. Update the project regularly for accurate results.</p>
    </>
  );
}
