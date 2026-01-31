"use client";

import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import MapPanel from "@/components/map-panel";
import Sparkline from "@/components/sparkline";
import { mockData } from "@/data/mock-data";
import type { Asset, DataStore, Telemetry, Zone } from "@/types/data";
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

const createStore = () => JSON.parse(JSON.stringify(mockData)) as DataStore;

const pad3 = (value: number) => String(value).padStart(3, "0");

const sampleWithinBounds = (zone: Zone) => {
  const delta = zone.lengthKm / 2 / 111.32;
  const lat = zone.latitude + (Math.random() * 2 - 1) * delta;
  const lng = zone.longitude + (Math.random() * 2 - 1) * delta;
  return { lat, lng };
};

const getNextPoleNumber = (assets: Asset[]) => {
  const maxNum = assets.reduce((max, asset) => {
    const match = asset.poleId.match(/(\d+)$/);
    const num = match ? Number(match[1]) : 0;
    return Number.isNaN(num) ? max : Math.max(max, num);
  }, 0);
  return maxNum + 1;
};

export default function LiveMapPage() {
  const [store, setStore] = useState<DataStore>(createStore);
  const [selectedPoleId, setSelectedPoleId] = useState(store.assets[0]?.poleId);
  const [isTicketOpen, setIsTicketOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [apiZones, setApiZones] = useState<
    {
      zone_id: string;
      name: string;
      length_km: number | string | null;
      latitude: number | null;
      longitude: number | null;
      poles: number | null;
    }[]
  >([]);
  const [zonesLoading, setZonesLoading] = useState(true);
  const [zonesError, setZonesError] = useState<string | null>(null);
  const [editingZone, setEditingZone] = useState<{
    zone_id: string;
    name: string;
    poles: number | null;
  } | null>(null);
  const [editZoneForm, setEditZoneForm] = useState({
    zoneName: "",
    poles: "",
  });
  const [ticketForm, setTicketForm] = useState({
    lightId: "",
    sectionId: "",
    maintenanceType: "",
    scheduledDate: "",
    completedDate: "",
    status: "pending",
    assignedTo: "",
    notes: "",
  });
  const [isZoneOpen, setIsZoneOpen] = useState(false);
  const [zoneForm, setZoneForm] = useState({
    zoneName: "",
    highwaySection: "",
    poles: "",
  });

  const addPoleForZone = (zone: Zone) => {
    const { lat, lng } = sampleWithinBounds(zone);
    const nextNumber = getNextPoleNumber(store.assets);
    const poleId = `NH44-P${pad3(nextNumber)}`;
    const controllerId = `CTRL-${pad3(nextNumber)}`;
    const newAsset: Asset = {
      poleId,
      zoneId: zone.zoneId,
      gps: { lat, lng },
      fixtureType: "LED-120W",
      controllerId,
      installedOn: "2026-01-30",
      status: "ACTIVE",
    };
    const newTelemetry: Telemetry = {
      poleId,
      timestamp: new Date().toISOString(),
      state: "ON",
      voltage: 229.2,
      current: 0.48,
      powerW: 110.4,
      energyKwh: 2.1,
      ambientLux: 14,
      temperatureC: 31.2,
    };

    setStore((prev) => ({
      ...prev,
      zones: prev.zones.map((item) =>
        item.zoneId === zone.zoneId ? { ...item, poles: item.poles + 1 } : item
      ),
      assets: [...prev.assets, newAsset],
      controllers: [
        ...prev.controllers,
        {
          controllerId,
          firmware: "v1.2.3",
          lastSeen: new Date().toISOString(),
          connectivity: "4G",
        },
      ],
      telemetry: [...prev.telemetry, newTelemetry],
    }));
    setSelectedPoleId(poleId);
  };

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

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    const loadZones = async () => {
      try {
        setZonesLoading(true);
        setZonesError(null);
        const response = await fetch("http://localhost:3000/api/zones");
        if (!response.ok) {
          throw new Error(`Failed to load zones: ${response.status}`);
        }
        const payload = (await response.json()) as {
          success?: boolean;
          data?: {
            zone_id: string;
            name: string;
            length_km: number | string | null;
            latitude: number | null;
            longitude: number | null;
            poles: number | null;
          }[];
        };
        if (!payload.success || !payload.data) {
          throw new Error("Invalid zones response");
        }
        setApiZones(payload.data);
      } catch (error) {
        setZonesError(error instanceof Error ? error.message : "Failed to load zones");
      } finally {
        setZonesLoading(false);
      }
    };
    loadZones();
  }, []);

  const handleTicketChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setTicketForm((prev) => ({ ...prev, [name]: value }));
  };

  const openEditZone = (zone: {
    zone_id: string;
    name: string;
    poles: number | null;
  }) => {
    setEditingZone(zone);
    setEditZoneForm({
      zoneName: zone.name ?? "",
      poles: zone.poles !== null ? String(zone.poles) : "",
    });
  };

  const handleEditZoneChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setEditZoneForm((prev) => ({ ...prev, [name]: value }));
  };

  const submitEditZone = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingZone) return;
    const payload = {
      zone_name: editZoneForm.zoneName,
      poles: Number(editZoneForm.poles),
    };
    try {
      const response = await fetch(
        `http://localhost:3000/api/zones/${editingZone.zone_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Request failed: ${response.status} ${errorText}`);
      }
      setApiZones((prev) =>
        prev.map((zone) =>
          zone.zone_id === editingZone.zone_id
            ? { ...zone, name: payload.zone_name, poles: payload.poles }
            : zone
        )
      );
      setToast(
        `Zone updated: zone_name=${payload.zone_name} | poles=${payload.poles}`
      );
      setEditingZone(null);
    } catch (error) {
      setToast(
        error instanceof Error ? error.message : "Failed to update zone. Please try again."
      );
    }
  };

  const submitTicket = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const summary = [
      `light_id=${ticketForm.lightId || "—"}`,
      `section_id=${ticketForm.sectionId || "—"}`,
      `maintenance_type=${ticketForm.maintenanceType || "—"}`,
      `scheduled_date=${ticketForm.scheduledDate || "—"}`,
      `completed_date=${ticketForm.completedDate || "—"}`,
      `status=${ticketForm.status || "—"}`,
      `assigned_to=${ticketForm.assignedTo || "—"}`,
      `notes=${ticketForm.notes || "—"}`,
    ].join(" | ");
    setToast(`Maintenance ticket created: ${summary}`);
    setIsTicketOpen(false);
  };

  const handleZoneChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setZoneForm((prev) => ({ ...prev, [name]: value }));
  };

  const submitZone = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedBase = "http://localhost:3000/api/";
    const payload = {
      zone_name: zoneForm.zoneName,
      highway_section: zoneForm.highwaySection,
      poles: Number(zoneForm.poles),
    };
    try {
      const response = await fetch(`${normalizedBase}zones`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Request failed: ${response.status} ${errorText}`);
      }
      setToast(
        `Zone created: zone_name=${payload.zone_name} | highway_section=${payload.highway_section} | poles=${payload.poles}`
      );
      setIsZoneOpen(false);
    } catch (error) {
      setToast(
        error instanceof Error ? error.message : "Failed to create zone. Please try again."
      );
    }
  };
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
            zones={store.zones}
            selectedPoleId={selectedPoleId}
            onSelectPole={setSelectedPoleId}
          />
          <section className="table-card" style={{ marginTop: "16px" }}>
            <header className="table-header">
              <div>
                <h2>Zones</h2>
                <p>Live data from /api/zones</p>
              </div>
              <button className="secondary-btn" type="button" onClick={() => setIsZoneOpen(true)}>
                Add Zone
              </button>
            </header>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Zone ID</th>
                    <th>Name</th>
                    <th>Length (km)</th>
                    <th>Latitude</th>
                    <th>Longitude</th>
                    <th>Poles</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {zonesLoading ? (
                    <tr>
                      <td colSpan={7}>Loading zones…</td>
                    </tr>
                  ) : zonesError ? (
                    <tr>
                      <td colSpan={7}>{zonesError}</td>
                    </tr>
                  ) : apiZones.length === 0 ? (
                    <tr>
                      <td colSpan={7}>No zones found.</td>
                    </tr>
                  ) : (
                    apiZones.map((zone) => (
                      <tr key={zone.zone_id}>
                        <td>
                          <span className="truncate-id" title={zone.zone_id}>
                            {zone.zone_id}
                          </span>
                        </td>
                        <td>{zone.name}</td>
                        <td>{zone.length_km ?? "—"}</td>
                        <td>{zone.latitude ?? "—"}</td>
                        <td>{zone.longitude ?? "—"}</td>
                        <td>{zone.poles ?? 0}</td>
                        <td>
                          <button
                            className="ghost-btn"
                            type="button"
                            onClick={() =>
                              openEditZone({
                                zone_id: zone.zone_id,
                                name: zone.name,
                                poles: zone.poles ?? 0,
                              })
                            }
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
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

          <button className="primary-btn" type="button" onClick={() => setIsTicketOpen(true)}>
            Create Maintenance Ticket
          </button>
        </aside>
      </section>
      {isTicketOpen ? (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal-card">
            <div className="modal-header">
              <h3>Create Maintenance Ticket</h3>
              <button className="ghost-btn" type="button" onClick={() => setIsTicketOpen(false)}>
                Close
              </button>
            </div>
            <form className="modal-form" onSubmit={submitTicket}>
              <label className="form-field">
                <span>Light ID</span>
                <input
                  name="lightId"
                  value={ticketForm.lightId}
                  onChange={handleTicketChange}
                  placeholder="e.g. 101"
                />
              </label>
              <label className="form-field">
                <span>Section ID</span>
                <input
                  name="sectionId"
                  value={ticketForm.sectionId}
                  onChange={handleTicketChange}
                  placeholder="e.g. 44"
                />
              </label>
              <label className="form-field">
                <span>Maintenance Type</span>
                <input
                  name="maintenanceType"
                  value={ticketForm.maintenanceType}
                  onChange={handleTicketChange}
                  placeholder="Routine check"
                />
              </label>
              <label className="form-field">
                <span>Scheduled Date</span>
                <input
                  name="scheduledDate"
                  type="datetime-local"
                  value={ticketForm.scheduledDate}
                  onChange={handleTicketChange}
                />
              </label>
              <label className="form-field">
                <span>Completed Date</span>
                <input
                  name="completedDate"
                  type="datetime-local"
                  value={ticketForm.completedDate}
                  onChange={handleTicketChange}
                />
              </label>
              <label className="form-field">
                <span>Status</span>
                <select name="status" value={ticketForm.status} onChange={handleTicketChange}>
                  <option value="pending">pending</option>
                  <option value="in_progress">in_progress</option>
                  <option value="completed">completed</option>
                </select>
              </label>
              <label className="form-field">
                <span>Assigned To</span>
                <input
                  name="assignedTo"
                  value={ticketForm.assignedTo}
                  onChange={handleTicketChange}
                  placeholder="User ID"
                />
              </label>
              <label className="form-field">
                <span>Notes</span>
                <textarea
                  name="notes"
                  rows={3}
                  value={ticketForm.notes}
                  onChange={handleTicketChange}
                  placeholder="Notes"
                />
              </label>
              <div className="modal-actions">
                <button className="primary-btn" type="submit">
                  Submit Ticket
                </button>
                <button
                  className="ghost-btn"
                  type="button"
                  onClick={() => setIsTicketOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
      {toast ? <div className="toast">{toast}</div> : null}
      {isZoneOpen ? (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal-card">
            <div className="modal-header">
              <h3>Create Zone</h3>
              <button className="ghost-btn" type="button" onClick={() => setIsZoneOpen(false)}>
                Close
              </button>
            </div>
            <form className="modal-form" onSubmit={submitZone}>
              <label className="form-field">
                <span>Zone Name</span>
                <input
                  name="zoneName"
                  value={zoneForm.zoneName}
                  onChange={handleZoneChange}
                  placeholder="Delhi NH-1"
                  required
                />
              </label>
              <label className="form-field">
                <span>Highway Section</span>
                <input
                  name="highwaySection"
                  value={zoneForm.highwaySection}
                  onChange={handleZoneChange}
                  placeholder="NH-1"
                  required
                />
              </label>
              <label className="form-field">
                <span>Poles</span>
                <input
                  name="poles"
                  type="number"
                  min="0"
                  value={zoneForm.poles}
                  onChange={handleZoneChange}
                  placeholder="100"
                  required
                />
              </label>
              <div className="modal-actions">
                <button className="primary-btn" type="submit">
                  Submit Zone
                </button>
                <button className="ghost-btn" type="button" onClick={() => setIsZoneOpen(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
      {editingZone ? (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal-card">
            <div className="modal-header">
              <h3>Edit Zone</h3>
              <button className="ghost-btn" type="button" onClick={() => setEditingZone(null)}>
                Close
              </button>
            </div>
            <form className="modal-form" onSubmit={submitEditZone}>
              <label className="form-field">
                <span>Zone Name</span>
                <input
                  name="zoneName"
                  value={editZoneForm.zoneName}
                  onChange={handleEditZoneChange}
                  placeholder="Delhi NH-1"
                  required
                />
              </label>
              <label className="form-field">
                <span>Poles</span>
                <input
                  name="poles"
                  type="number"
                  min="0"
                  value={editZoneForm.poles}
                  onChange={handleEditZoneChange}
                  placeholder="120"
                  required
                />
              </label>
              <div className="modal-actions">
                <button className="primary-btn" type="submit">
                  Update Zone
                </button>
                <button className="ghost-btn" type="button" onClick={() => setEditingZone(null)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
