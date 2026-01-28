# User Stories & Acceptance Criteria

## Epic: Monitoring & Alerts
1. **As an Operations Manager**, I want to see live system KPIs so I can detect issues quickly.
   - Acceptance: Dashboard shows uptime, active faults, energy usage, and affected segments.
2. **As an Operations Manager**, I want alert prioritization so I can focus on critical outages.
   - Acceptance: Alerts are tagged as critical/warn/info with filters and timestamps.
3. **As a Maintenance Supervisor**, I want an alert-to-ticket flow so I can dispatch crews fast.
   - Acceptance: A ticket can be created from an alert in one action.

## Epic: Control & Automation
4. **As an Ops Manager**, I want to apply dimming schedules to reduce energy costs.
   - Acceptance: Schedule supports time windows, dimming levels, and segment selection.
5. **As an Ops Manager**, I want to override automation during incidents.
   - Acceptance: Manual override is logged with user, time, and reason.
6. **As an Admin**, I want audit logs for all control changes.
   - Acceptance: Audit log captures who, what, when, and scope of change.

## Epic: Maintenance & SLA
7. **As a Maintenance Supervisor**, I want to track ticket status and SLA so I can ensure compliance.
   - Acceptance: Tickets show status, SLA deadline, and assigned crew.
8. **As a Field Technician**, I want mobile-first ticket views so I can work in the field.
   - Acceptance: Ticket view works on small screens, includes location and safety notes.

## Epic: Analytics & Reporting
9. **As a Decision Maker**, I want trend analytics to evaluate performance.
   - Acceptance: Charts show trends for faults, uptime, and energy usage.
10. **As a Decision Maker**, I want exportable reports.
   - Acceptance: Reports can be exported as CSV/PDF (mocked initially).

## Epic: Feasibility & Comparison
11. **As a Decision Maker**, I want CAPEX/OPEX and ROI estimates.
   - Acceptance: Feasibility view shows cost breakdown and payback estimate.
12. **As a Decision Maker**, I want a baseline vs proposed comparison.
   - Acceptance: Comparison view lists deltas for cost, energy, and uptime.

## Epic: Pilot & Environmental Impact
13. **As a Project Lead**, I want a pilot framework to plan rollout.
   - Acceptance: Pilot view shows selection criteria, timeline, and risks.
14. **As a Sustainability Officer**, I want CO₂ reduction estimates.
   - Acceptance: Environmental view shows CO₂ savings and carbon credit potential.
