const deliveryModel = [
  {
    title: "PPP + ESCO",
    detail: "Capex shared with energy service partner, savings-backed model.",
  },
  {
    title: "Central NOC",
    detail: "24x7 monitoring, alarm triage, and automated dispatch.",
  },
  {
    title: "SLA-driven O&M",
    detail: "Response and restoration metrics aligned to NHAI guidelines.",
  },
  {
    title: "Data Governance",
    detail: "Audit trails, role-based access, and monthly compliance reports.",
  },
];

const timeline = [
  {
    phase: "Design Freeze",
    duration: "Weeks 1-2",
    outcome: "Signed functional scope, firmware baseline, data dictionary.",
  },
  {
    phase: "Hardware Retrofit",
    duration: "Weeks 3-6",
    outcome: "LED upgrade, controller fitment, field commissioning.",
  },
  {
    phase: "Platform Integration",
    duration: "Weeks 5-8",
    outcome: "NOC dashboards, alert workflows, and KPI wiring.",
  },
  {
    phase: "Pilot Operations",
    duration: "Weeks 9-12",
    outcome: "Full SLA measurement and monthly reporting.",
  },
];

const costStack = [
  {
    item: "LED retrofit + controller",
    capex: "62%",
    opex: "-",
    notes: "Fixtures, controllers, gateway hardware.",
  },
  {
    item: "Connectivity + data",
    capex: "8%",
    opex: "25%",
    notes: "SIM, NB-IoT backup, data storage.",
  },
  {
    item: "NOC operations",
    capex: "5%",
    opex: "40%",
    notes: "Staffing, escalation, dispatch.",
  },
  {
    item: "Field maintenance",
    capex: "3%",
    opex: "25%",
    notes: "Preventive visits, spares, repair.",
  },
  {
    item: "Platform licensing",
    capex: "22%",
    opex: "10%",
    notes: "Analytics, reporting, security audits.",
  },
];

const governance = [
  "Joint steering committee with monthly KPI review.",
  "Quarterly audit covering SLA compliance and savings validation.",
  "Change control board for firmware and control policy updates.",
];

export default function ImplementationModelPage() {
  return (
    <div className="page">
      <section className="page-header">
        <div>
          <span className="inline-tag">Phase 5 · Implementation</span>
          <h1>Implementation Model</h1>
          <p>Delivery model, timeline, and cost structure for rollout.</p>
        </div>
      </section>

      <section className="section-grid">
        {deliveryModel.map((item) => (
          <div key={item.title} className="info-card">
            <h2>{item.title}</h2>
            <p className="card-muted">{item.detail}</p>
          </div>
        ))}
      </section>

      <section className="table-card">
        <header>
          <h2>Implementation Timeline</h2>
          <p>Key phases aligned to pilot readiness.</p>
        </header>
        <div className="timeline">
          {timeline.map((item) => (
            <div key={item.phase} className="timeline-item">
              <div className="timeline-header">
                <strong>{item.phase}</strong>
                <span className="timeline-duration">{item.duration}</span>
              </div>
              <p className="card-muted">{item.outcome}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="table-card">
        <header>
          <h2>Cost Stack</h2>
          <p>Indicative split across capex and opex buckets.</p>
        </header>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Capex Share</th>
                <th>Opex Share</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {costStack.map((row) => (
                <tr key={row.item}>
                  <td>{row.item}</td>
                  <td>{row.capex}</td>
                  <td>{row.opex}</td>
                  <td>{row.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="info-card">
        <h2>Governance & Reporting</h2>
        <ul className="bullet-list">
          {governance.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
