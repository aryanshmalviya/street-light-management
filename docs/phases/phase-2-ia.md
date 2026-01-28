# Phase 2 — Information Architecture & UX

## Goals
- Define sitemap and navigation model.
- Map key user flows for monitoring, control, maintenance, and reporting.
- Translate deliverables into page-level responsibilities.

## Sitemap (Draft)
- **Dashboard** (live KPIs, alerts, status overview)
- **Map / Segments** (geographic view, segment health)
- **Control Center** (automation rules, schedules, manual overrides)
- **Maintenance** (tickets, SLAs, crew assignments)
- **Analytics** (energy, uptime, faults, trends)
- **Feasibility** (CAPEX/OPEX, ROI, payback)
- **Comparison** (current vs proposed systems)
- **Pilot Framework** (plaza selection, rollout plan)
- **Environmental Impact** (CO₂ reduction, carbon credits)
- **Admin / Settings** (assets, users, roles)

## Navigation Model
- Mobile: bottom nav with 4–5 primary items + overflow menu.
- Desktop: left rail with section groups + top status bar.
- Global quick actions: create ticket, override group, schedule dimming.

## Key User Flows (Draft)
1. **Live Monitoring**: Dashboard → Map → Segment detail → Alert detail.
2. **Fault Triage**: Alert → Ticket create → Assign crew → Close ticket.
3. **Control Override**: Control Center → Select segment → Apply override → Audit log.
4. **Schedule Automation**: Control Center → Schedule → Validate → Activate.
5. **Analytics Review**: Analytics → Filter → Export report.
6. **Feasibility Review**: Feasibility → Scenario compare → ROI summary.
7. **Pilot Proposal**: Pilot Framework → Select plazas → Implementation plan.

## Page Responsibilities (Draft)
- Dashboard: status KPIs, real-time alerts, energy snapshot.
- Map/Segments: health by segment, drill-down to assets.
- Control Center: rules, schedules, manual overrides, audit trail.
- Maintenance: ticket lifecycle, SLA, crew coordination.
- Analytics: trend charts, benchmarks, export.
- Feasibility: cost model, savings, sensitivity.
- Comparison: baseline vs proposed, outcome deltas.
- Pilot Framework: selection criteria, rollout timeline, risks.
- Environmental Impact: CO₂ math, carbon credits estimation.

## Data Touchpoints
- Asset inventory, sensor data, events, tickets, schedules, energy usage.

## Open Questions
- Preferred KPIs for the dashboard.
- Reporting/export formats needed.
- Any mandated compliance standards or audit trails.
