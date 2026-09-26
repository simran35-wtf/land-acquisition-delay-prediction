import { useEffect, useState } from "react";
import { getDistrictStats, getFeatureImportance } from "../api/index.js";
import { apiErrorMessage } from "../api/client.js";

export default function Reports() {
  const [districtStats, setDistrictStats] = useState([]);
  const [importance, setImportance] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all([getDistrictStats(), getFeatureImportance()])
      .then(([stats, features]) => {
        if (cancelled) return;
        setDistrictStats(stats);
        setImportance(features.slice(0, 6));
      })
      .catch((e) => !cancelled && setError(apiErrorMessage(e)))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  const max = Math.max(1, ...districtStats.map((d) => d.high + d.medium + d.low));
  const maxImportance = Math.max(0.0001, ...importance.map((f) => f.importance));

  return (
    <>
      <h1 className="page-title">Reports &amp; Trends</h1>
      <p className="lead dark">District-wise view of acquisitions at risk, straight from the prediction API.</p>
      {error && <p className="api-banner">{error}</p>}
      {loading && <p className="muted">Loading reports…</p>}

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

      <section className="panel">
        <h2>What Drives Delay (model feature importance)</h2>
        <div className="dist-chart">
          {importance.map((f) => (
            <div key={f.feature} className="dist-row">
              <span className="dist-label">{f.feature.replace(/_/g, " ")}</span>
              <div className="dist-bars">
                <div className="dist-seg high" style={{ width: `${(f.importance / maxImportance) * 100}%` }} />
              </div>
              <span className="dist-total muted">{(f.importance * 100).toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
