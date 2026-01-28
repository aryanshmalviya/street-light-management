const options = [
  {
    title: "Conventional Timed Lighting",
    score: 58,
    summary: "Fixed schedules, manual overrides, limited analytics.",
    highlight: "Lowest capex, highest energy waste.",
  },
  {
    title: "LED Retrofit Only",
    score: 72,
    summary: "Efficient fixtures with basic remote control.",
    highlight: "Strong savings, limited automation.",
  },
  {
    title: "Smart Adaptive Lighting",
    score: 86,
    summary: "Adaptive dimming, fault sensing, centralized NOC.",
    highlight: "Best ROI, requires data platform.",
  },
];

const evaluationMatrix = [
  {
    criteria: "Energy savings",
    weight: 0.2,
    timed: 45,
    retrofit: 75,
    smart: 92,
  },
  {
    criteria: "Fault response time",
    weight: 0.15,
    timed: 40,
    retrofit: 55,
    smart: 88,
  },
  {
    criteria: "Operational visibility",
    weight: 0.15,
    timed: 35,
    retrofit: 62,
    smart: 90,
  },
  {
    criteria: "Capex efficiency",
    weight: 0.15,
    timed: 70,
    retrofit: 68,
    smart: 60,
  },
  {
    criteria: "Opex stability",
    weight: 0.15,
    timed: 48,
    retrofit: 64,
    smart: 82,
  },
  {
    criteria: "Scalability",
    weight: 0.1,
    timed: 42,
    retrofit: 60,
    smart: 86,
  },
  {
    criteria: "Compliance readiness",
    weight: 0.1,
    timed: 52,
    retrofit: 66,
    smart: 84,
  },
];

export default function ComparativeEvaluationPage() {
  return (
    <div className="page">
      <section className="page-header">
        <div>
          <span className="inline-tag">Phase 5 · Comparison</span>
          <h1>Comparative Evaluation</h1>
          <p>Side-by-side evaluation of delivery and technology options.</p>
        </div>
      </section>

      <section className="section-grid">
        {options.map((option) => (
          <div key={option.title} className="info-card">
            <div className="card-title">
              <h2>{option.title}</h2>
              <span className="score-pill">Score {option.score}</span>
            </div>
            <p className="card-muted">{option.summary}</p>
            <p className="card-highlight">{option.highlight}</p>
          </div>
        ))}
      </section>

      <section className="table-card">
        <header>
          <h2>Evaluation Matrix</h2>
          <p>Weighted scoring across operational and financial criteria.</p>
        </header>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Criteria</th>
                <th>Weight</th>
                <th>Timed</th>
                <th>Retrofit</th>
                <th>Smart</th>
              </tr>
            </thead>
            <tbody>
              {evaluationMatrix.map((row) => (
                <tr key={row.criteria}>
                  <td>{row.criteria}</td>
                  <td>{(row.weight * 100).toFixed(0)}%</td>
                  <td>{row.timed}</td>
                  <td>{row.retrofit}</td>
                  <td>{row.smart}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="info-card">
        <h2>Recommendation</h2>
        <p className="card-muted">
          Smart adaptive lighting delivers the highest lifecycle value when paired with
          centralized monitoring. LED retrofit only can be positioned as a fallback option
          in zones where connectivity is constrained.
        </p>
        <div className="tag-row">
          <span className="pill resolved">Preferred</span>
          <span className="pill in_progress">Fallback</span>
          <span className="pill open">Legacy</span>
        </div>
      </section>
    </div>
  );
}
