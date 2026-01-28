# Phase 1 — Discovery & Scope

## Goals
- Align problem framing with hackathon deliverables.
- Define target users, workflows, and success metrics.
- Establish a baseline for later comparisons (current system vs proposed).

## Inputs
- Problem statement (centralized automation, monitoring, intelligent management).
- Hackathon deliverables: feasibility, comparative evaluation, pilot framework, environmental benefits.

## Outcomes
- User personas and top workflows.
- MVP scope and non‑goals.
- KPIs and data requirements.
- High‑level solution concept.

## User Personas (Draft)
- **Highway Operations Manager**: needs live status, alerts, and system health.
- **Maintenance Supervisor**: needs fault queues, SLA tracking, dispatching.
- **Field Technician**: needs task details, location, and safety guidance on mobile.
- **Decision Maker**: needs ROI, energy savings, and environmental impact reports.

## Core Workflows (Draft)
1. Monitor live lighting status and outages by segment.
2. Detect and triage faults with timestamps and priority.
3. Apply automated dimming schedules and override controls.
4. Track maintenance actions, response time, and closure.
5. Review analytics for energy, uptime, and cost savings.

## Success Metrics (Draft)
- Mean time to detect (MTTD) and mean time to repair (MTTR).
- Energy consumption reduction (%).
- Uptime/availability (%).
- Maintenance response compliance (% SLA).
- Estimated CO₂ reduction (tons/year).

## Data Requirements (Draft)
- Asset inventory (pole, lamp, controller).
- Segment metadata (km range, plaza, highway).
- Sensor readings (power, voltage, current, ambient light).
- Event logs (faults, overrides, schedules).
- Maintenance tickets (status, timestamps, crew).

## Scope (MVP)
- Dashboard, Map/Segments, Control Center, Maintenance, Analytics, Feasibility, Environmental Impact.
- Mock data layer with realistic schema.

## Out of Scope (Phase 1)
- Real device integrations.
- Live telemetry streaming.
- Payments or billing systems.

## Open Questions
- Pilot plaza selection criteria.
- Baseline energy usage assumptions.
- Carbon credit methodology to adopt.
