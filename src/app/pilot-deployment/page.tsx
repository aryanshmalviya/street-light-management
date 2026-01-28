import { mockData } from "@/data/mock-data";

const goals = [
  {
    title: "Reduce Energy",
    detail: "Target 35% reduction vs baseline within 90 days.",
  },
  {
    title: "Improve SLA",
    detail: "Restore critical faults within 4 hours.",
  },
  {
    title: "Validate ROI",
    detail: "Confirm payback assumptions and tariff sensitivity.",
  },
  {
    title: "Operationalize NOC",
    detail: "Enable automated dispatch and reporting cadence.",
  },
];

const milestones = [
  {
    phase: "Kickoff + Survey",
    window: "Week 1",
    deliverable: "Field audit, pole inventory, baseline energy data.",
  },
  {
    phase: "Retrofit + Commission",
    window: "Weeks 2-4",
    deliverable: "LED upgrade, controller install, gateway validation.",
  },
  {
    phase: "Control Policy",
    window: "Weeks 5-6",
    deliverable: "Dimming schedules, safety overrides, escalation rules.",
  },
  {
    phase: "Pilot Ops",
    window: "Weeks 7-12",
    deliverable: "KPI tracking, SLA reports, savings verification.",
  },
];

const successMetrics = [
  "Energy savings greater than 30% for 2 consecutive billing cycles.",
  "Mean time to repair below 6 hours for critical faults.",
  "Uptime above 97% across pilot zones.",
  "Monthly compliance report delivered within 5 working days.",
];

export default function PilotDeploymentPage() {
  const pilotZones = mockData.zones.map((zone) => ({
    zoneId: zone.zoneId,
    name: zone.name,
    lengthKm: zone.lengthKm,
    poles: zone.poles,
  }));

  return (
    <div className="page">
      <section className="page-header">
        <div>
          <span className="inline-tag">Phase 5 · Pilot</span>
          <h1>Pilot Deployment Framework</h1>
          <p>Scope, milestones, and success metrics for pilot validation.</p>
        </div>
      </section>

      <section className="section-grid">
        {goals.map((goal) => (
          <div key={goal.title} className="info-card">
            <h2>{goal.title}</h2>
            <p className="card-muted">{goal.detail}</p>
          </div>
        ))}
      </section>

      <section className="table-card">
        <header>
          <h2>Pilot Footprint</h2>
          <p>Zones included in pilot scope.</p>
        </header>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Zone</th>
                <th>Segment</th>
                <th>Length (km)</th>
                <th>Pole Count</th>
              </tr>
            </thead>
            <tbody>
              {pilotZones.map((zone) => (
                <tr key={zone.zoneId}>
                  <td>{zone.zoneId}</td>
                  <td>{zone.name}</td>
                  <td>{zone.lengthKm.toFixed(1)}</td>
                  <td>{zone.poles}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="table-card">
        <header>
          <h2>Milestones</h2>
          <p>Sequenced rollout plan and deliverables.</p>
        </header>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Phase</th>
                <th>Window</th>
                <th>Deliverable</th>
              </tr>
            </thead>
            <tbody>
              {milestones.map((row) => (
                <tr key={row.phase}>
                  <td>{row.phase}</td>
                  <td>{row.window}</td>
                  <td>{row.deliverable}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="info-card">
        <h2>Success Metrics</h2>
        <ul className="bullet-list">
          {successMetrics.map((metric) => (
            <li key={metric}>{metric}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
