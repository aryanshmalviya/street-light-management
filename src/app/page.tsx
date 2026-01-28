import Link from "next/link";

export default function HomePage() {
  return (
    <div className="overview">
      <section className="hero">
        <div>
          <span className="inline-tag">Phase 3 · Admin MVP</span>
          <h1>Street Light Management Console</h1>
          <p>
            A map-first control tower for National Highway lighting. Use the live
            map to monitor poles, track KPIs, and manage faults with centralized
            automation and reporting.
          </p>
        </div>
      </section>

      <section className="overview-grid">
        <Link className="overview-card" href="/live-map">
          <h2>Live Map Dashboard</h2>
          <p>Map-based KPIs with pole-level insights and health status.</p>
          <span>Open Live Map →</span>
        </Link>
        <Link className="overview-card" href="/faults-alerts">
          <h2>Faults & Alerts</h2>
          <p>Active faults, severity, and resolution tracking.</p>
          <span>Review Faults →</span>
        </Link>
        <Link className="overview-card" href="/energy-emissions">
          <h2>Energy & Emissions</h2>
          <p>Energy savings, CO₂ impact, and baseline comparisons.</p>
          <span>View Energy →</span>
        </Link>
        <Link className="overview-card" href="/maintenance-sla">
          <h2>Maintenance & SLA</h2>
          <p>Ticket workflow, response times, and SLA compliance.</p>
          <span>Open Maintenance →</span>
        </Link>
        <Link className="overview-card" href="/feasibility">
          <h2>Feasibility Review</h2>
          <p>Technical, operational, and financial readiness checkpoints.</p>
          <span>Review Feasibility →</span>
        </Link>
        <Link className="overview-card" href="/comparative-evaluation">
          <h2>Comparative Evaluation</h2>
          <p>Option scoring and recommendation matrix.</p>
          <span>Compare Options →</span>
        </Link>
        <Link className="overview-card" href="/implementation-model">
          <h2>Implementation Model</h2>
          <p>Delivery timeline, cost stack, and governance.</p>
          <span>View Model →</span>
        </Link>
        <Link className="overview-card" href="/pilot-deployment">
          <h2>Pilot Deployment</h2>
          <p>Scope, milestones, and success metrics.</p>
          <span>Open Pilot →</span>
        </Link>
        <Link className="overview-card" href="/environmental-impact">
          <h2>Environmental Impact</h2>
          <p>CO2 savings and carbon credit calculator.</p>
          <span>Calculate Impact →</span>
        </Link>
      </section>
    </div>
  );
}
