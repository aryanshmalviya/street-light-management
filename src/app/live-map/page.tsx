"use client";

import { useMemo, useState } from "react";
import MapPanel from "@/components/map-panel";
import Sparkline from "@/components/sparkline";
import { mockData } from "@/data/mock-data";
import {
  getActiveFaults,
  getAvgResponseTimeMinutes,
  getLatestTimestamp,
  getPoleFault,
  getPoleStatus,
  getSlaCompliancePct,
  getUptimePct,
  getZoneEnergy,
} from "@/lib/kpis";

export default function LiveMapPage() {
  const store = mockData;
  const [selectedPoleId, setSelectedPoleId] = useState(store.assets[0]?.poleId);

  const kpis = useMemo(() => {
    const energy = getZoneEnergy(store);
    return {
      uptimePct: getUptimePct(store),
      activeFaults: getActiveFaults(store).length,
      energyToday: energy.totalEnergyKwh,
      co2SavedKg: energy.co2SavedKg,
      slaCompliance: getSlaCompliancePct(store),
      avgResponse: getAvgResponseTimeMinutes(store),
    };
  }, [store]);

  const latestTimestamp = getLatestTimestamp(store);
  const selectedTelemetry = selectedPoleId
    ? getPoleStatus(store, selectedPoleId)
    : undefined;
  const selectedFault = selectedPoleId ? getPoleFault(store, selectedPoleId) : undefined;

  const trendEnergy = [28, 31, 30, 34, 33, 35, 32];
  const trendUptime = [98.2, 98.6, 99.1, 98.9, 99.4, 99.2, 99.3];
  const trendFaults = [5, 4, 3, 4, 2, 3, 2];

  return (
    <div className="dashboard">
      <section className="hero">
        <div>
          <span className="inline-tag">Admin Console · KPI + Map Control</span>
          <h1>National Highway Lighting Intelligence Hub</h1>
          <p>
            Monitor live highway lighting, detect faults instantly, and optimize
            energy with centralized automation. Map-first insights with KPI
            tracking for uptime, SLA, and emissions.
          </p>
        </div>
        <div className="hero-meta">
          <div>
            <p className="meta-label">Live Window</p>
            <p className="meta-value">{latestTimestamp ?? "—"}</p>
          </div>
          <div>
            <p className="meta-label">Active Zones</p>
            <p className="meta-value">{store.zones.length}</p>
          </div>
          <div>
            <p className="meta-label">Poles Monitored</p>
            <p className="meta-value">{store.assets.length}</p>
          </div>
        </div>
      </section>

      <section className="kpi-grid">
        <div className="kpi-card accent">
          <p className="kpi-label">Uptime</p>
          <p className="kpi-value">{kpis.uptimePct.toFixed(1)}%</p>
          <Sparkline data={trendUptime} />
          <span className="kpi-foot">Target 99.0%</span>
        </div>
        <div className="kpi-card">
          <p className="kpi-label">Active Faults</p>
          <p className="kpi-value">{kpis.activeFaults}</p>
          <Sparkline data={trendFaults} />
          <span className="kpi-foot">Live from telemetry</span>
        </div>
        <div className="kpi-card">
          <p className="kpi-label">Energy Today</p>
          <p className="kpi-value">{kpis.energyToday.toFixed(1)} kWh</p>
          <Sparkline data={trendEnergy} />
          <span className="kpi-foot">Across all zones</span>
        </div>
        <div className="kpi-card">
          <p className="kpi-label">CO₂ Saved</p>
          <p className="kpi-value">{kpis.co2SavedKg.toFixed(1)} kg</p>
          <span className="kpi-foot">Estimated from baseline</span>
        </div>
        <div className="kpi-card">
          <p className="kpi-label">SLA Compliance</p>
          <p className="kpi-value">{kpis.slaCompliance.toFixed(1)}%</p>
          <span className="kpi-foot">Closed tickets within SLA</span>
        </div>
        <div className="kpi-card">
          <p className="kpi-label">Avg Response Time</p>
          <p className="kpi-value">{kpis.avgResponse.toFixed(0)} min</p>
          <span className="kpi-foot">Time to first response</span>
        </div>
      </section>

      <section className="main-grid">
        <div className="map-panel">
          <div className="panel-header">
            <div>
              <h2>Live Map</h2>
              <p>Click a pole to inspect KPIs and maintenance status.</p>
            </div>
            <div className="legend">
              <span className="legend-item ok">On</span>
              <span className="legend-item warn">Dimmed</span>
              <span className="legend-item alert">Fault</span>
              <span className="legend-item off">Offline</span>
            </div>
          </div>
          <MapPanel
            assets={store.assets}
            telemetry={store.telemetry}
            selectedPoleId={selectedPoleId}
            onSelectPole={setSelectedPoleId}
          />
        </div>

        <aside className="detail-panel">
          <div className="panel-header">
            <h2>Pole Insights</h2>
            <p>{selectedPoleId ?? "Select a pole"}</p>
          </div>

          <div className="detail-card">
            <h3>Current Status</h3>
            <div className="detail-row">
              <span>State</span>
              <strong>{selectedTelemetry?.state ?? "—"}</strong>
            </div>
            <div className="detail-row">
              <span>Power</span>
              <strong>{selectedTelemetry?.powerW ?? "—"} W</strong>
            </div>
            <div className="detail-row">
              <span>Energy</span>
              <strong>{selectedTelemetry?.energyKwh ?? "—"} kWh</strong>
            </div>
            <div className="detail-row">
              <span>Temperature</span>
              <strong>{selectedTelemetry?.temperatureC ?? "—"} °C</strong>
            </div>
          </div>

          <div className="detail-card">
            <h3>Reliability</h3>
            <div className="detail-row">
              <span>Fault Code</span>
              <strong>{selectedFault?.faultCode ?? "None"}</strong>
            </div>
            <div className="detail-row">
              <span>Severity</span>
              <strong>{selectedFault?.severity ?? "—"}</strong>
            </div>
            <div className="detail-row">
              <span>Detected</span>
              <strong>{selectedFault?.detectedAt ?? "—"}</strong>
            </div>
          </div>

          <div className="detail-card">
            <h3>Environmental</h3>
            <div className="detail-row">
              <span>CO₂ Saved (zone)</span>
              <strong>
                {store.energySummary
                  .filter(
                    (item) =>
                      item.zoneId ===
                      store.assets.find((asset) => asset.poleId === selectedPoleId)
                        ?.zoneId
                  )
                  .reduce((sum, item) => sum + item.co2SavedKg, 0)
                  .toFixed(1)}{" "}
                kg
              </strong>
            </div>
            <div className="detail-row">
              <span>Emission Intensity</span>
              <strong>0.82 kg/kWh</strong>
            </div>
          </div>

          <button className="primary-btn" type="button">
            Create Maintenance Ticket
          </button>
        </aside>
      </section>
    </div>
  );
}
