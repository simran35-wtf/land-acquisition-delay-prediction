import { districtStats } from "../data/mockData.js";

export default function Reports() {
  const max = 8;
  return (
    <>
      <h1 className="page-title">Reports &amp; Trends</h1>
      <p className="lead dark">District-wise view of acquisitions at risk.</p>
      <section className="panel">
        <h2>Projects by District &amp; Risk</h2>
        <div className="dist-chart">
          {districtStats.map((d) => (
            <div key={d.district} className="dist-row">
              <span className="dist-label">{d.district}</span>
              <div className="dist-bars">
                <div className="dist-seg high" style={{ width: `${(d.high / max) * 100}%` }} title={`${d.high} High`} />
                <div className="dist-seg medium" style={{ width: `${(d.medium / max) * 100}%` }} title={`${d.medium} Medium`} />
                <div className="dist-seg low" style={{ width: `${(d.low / max) * 100}%` }} title={`${d.low} Low`} />
              </div>
              <span className="dist-total muted">{d.high + d.medium + d.low} total</span>
            </div>
          ))}
        </div>
        <div className="chart-legend">
          <span><i className="dot high" />High</span>
          <span><i className="dot medium" />Medium</span>
          <span><i className="dot low" />Low</span>
        </div>
      </section>
    </>
  );
}
