const readinessCards = [
  {
    label: "Technical Feasibility",
    score: 82,
    note: "Control stack, telemetry, and adaptive dimming validated.",
  },
  {
    label: "Operational Feasibility",
    score: 76,
    note: "Field team coverage aligned with zone footprint.",
  },
  {
    label: "Financial Feasibility",
    score: 68,
    note: "Payback tied to LED retrofit and energy tariff index.",
  },
  {
    label: "Regulatory Feasibility",
    score: 74,
    note: "Drafted to align with NHAI and DISCOM norms.",
  },
];

const feasibilityChecklist = [
  {
    category: "Technology",
    item: "Adaptive dimming firmware rollout",
    owner: "Controls Team",
    status: "IN_PROGRESS",
  },
  {
    category: "Operations",
    item: "24x7 NOC staffing plan",
    owner: "Operations",
    status: "OPEN",
  },
  {
    category: "Finance",
    item: "Tariff escalation sensitivity",
    owner: "Finance",
    status: "IN_PROGRESS",
  },
  {
    category: "Regulatory",
    item: "DISCOM no-objection confirmation",
    owner: "Compliance",
    status: "RESOLVED",
  },
];

const riskRegister = [
  {
    risk: "Delayed pole retrofit approvals",
    impact: "Schedule slip",
    severity: "HIGH",
    mitigation: "Pre-approve vendor lists with EPC partner.",
  },
  {
    risk: "4G backhaul saturation",
    impact: "Telemetry lag",
    severity: "MEDIUM",
    mitigation: "NB-IoT fallback and buffered sync.",
  },
  {
    risk: "Energy tariff volatility",
    impact: "Payback variance",
    severity: "MEDIUM",
    mitigation: "Tariff hedging clause in PPP model.",
  },
  {
    risk: "Field spares shortage",
    impact: "SLA breach",
    severity: "LOW",
    mitigation: "Regional buffer inventory defined.",
  },
];

const assumptions = [
  "Pilot operates on LED retrofits with 30-40% dimming windows.",
  "DISCOM metering and billing cycle shared monthly.",
  "NOC staffed with 2-tier escalation and on-call rotation.",
  "Data retention and audit logs retained for 12 months.",
];

export default function FeasibilityPage() {
  return (
    <div className="page">
      <section className="page-header">
        <div>
          <span className="inline-tag">Phase 5 · Feasibility</span>
          <h1>Feasibility & Readiness Review</h1>
          <p>Validate technical, operational, financial, and regulatory readiness.</p>
        </div>
      </section>

      <section className="kpi-grid">
        {readinessCards.map((card) => (
          <div key={card.label} className="kpi-card">
            <p className="kpi-label">{card.label}</p>
            <p className="kpi-value">{card.score}%</p>
            <p className="kpi-foot">{card.note}</p>
          </div>
        ))}
      </section>

      <section className="table-card">
        <header>
          <h2>Feasibility Checklist</h2>
          <p>Immediate actions needed before pilot launch.</p>
        </header>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Item</th>
                <th>Owner</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {feasibilityChecklist.map((row) => (
                <tr key={row.item}>
                  <td>{row.category}</td>
                  <td>{row.item}</td>
                  <td>{row.owner}</td>
                  <td>
                    <span className={`pill ${row.status.toLowerCase()}`}>
                      {row.status.replace("_", " ")}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="table-card">
        <header>
          <h2>Risk Register</h2>
          <p>Key risks and mitigation plan for rollout.</p>
        </header>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Risk</th>
                <th>Impact</th>
                <th>Severity</th>
                <th>Mitigation</th>
              </tr>
            </thead>
            <tbody>
              {riskRegister.map((row) => (
                <tr key={row.risk}>
                  <td>{row.risk}</td>
                  <td>{row.impact}</td>
                  <td>
                    <span className={`pill ${row.severity.toLowerCase()}`}>
                      {row.severity}
                    </span>
                  </td>
                  <td>{row.mitigation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="table-card">
        <header>
          <h2>Key Assumptions</h2>
          <p>Baseline assumptions used in feasibility scoring.</p>
        </header>
        <ul className="bullet-list">
          {assumptions.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
