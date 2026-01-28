"use client";

import { useMemo, useState } from "react";
import FilterBar from "@/components/filter-bar";
import SideDrawer from "@/components/side-drawer";
import Sparkline from "@/components/sparkline";
import { mockData } from "@/data/mock-data";

const toDate = (value: string) => (value ? new Date(value).getTime() : null);

export default function FaultsAlertsPage() {
  const { faults, zones } = mockData;
  const [filters, setFilters] = useState({
    zone: "",
    status: "",
    severity: "",
    startDate: "",
    endDate: "",
  });
  const [selectedFaultId, setSelectedFaultId] = useState<string | null>(null);

  const filteredFaults = useMemo(() => {
    const start = toDate(filters.startDate);
    const end = toDate(filters.endDate);

    return faults.filter((fault) => {
      if (filters.zone && fault.zoneId !== filters.zone) return false;
      if (filters.status && fault.status !== filters.status) return false;
      if (filters.severity && fault.severity !== filters.severity) return false;

      const detected = new Date(fault.detectedAt).getTime();
      if (start && detected < start) return false;
      if (end && detected > end + 86400000) return false;

      return true;
    });
  }, [faults, filters]);

  const activeFaults = filteredFaults.filter((fault) => fault.status === "OPEN");
  const highSeverity = filteredFaults.filter((fault) =>
    ["HIGH", "CRITICAL"].includes(fault.severity)
  ).length;

  const selectedFault = faults.find((fault) => fault.faultId === selectedFaultId);

  return (
    <div className="page">
      <section className="page-header">
        <div>
          <span className="inline-tag">Faults & Alerts</span>
          <h1>Active Fault Monitoring</h1>
          <p>Track open issues, severity, and resolution state.</p>
        </div>
      </section>

      <FilterBar
        zoneOptions={zones.map((zone) => ({ label: zone.name, value: zone.zoneId }))}
        statusOptions={[
          { label: "Open", value: "OPEN" },
          { label: "Resolved", value: "RESOLVED" },
        ]}
        severityOptions={[
          { label: "Low", value: "LOW" },
          { label: "Medium", value: "MEDIUM" },
          { label: "High", value: "HIGH" },
          { label: "Critical", value: "CRITICAL" },
        ]}
        filters={filters}
        onChange={setFilters}
        onReset={() =>
          setFilters({ zone: "", status: "", severity: "", startDate: "", endDate: "" })
        }
      />

      <section className="kpi-row">
        <div className="kpi-card">
          <p className="kpi-label">Active Faults</p>
          <p className="kpi-value">{activeFaults.length}</p>
          <Sparkline data={[6, 5, 4, 4, 3, 3, 2]} />
        </div>
        <div className="kpi-card">
          <p className="kpi-label">High Severity</p>
          <p className="kpi-value">{highSeverity}</p>
          <Sparkline data={[3, 2, 3, 2, 2, 1, 1]} />
        </div>
      </section>

      <section className="table-card">
        <header>
          <h2>Faults</h2>
          <p>Filtered results with severity and resolution state.</p>
        </header>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Fault ID</th>
                <th>Pole</th>
                <th>Zone</th>
                <th>Severity</th>
                <th>Detected</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredFaults.map((fault) => (
                <tr key={fault.faultId}>
                  <td>{fault.faultId}</td>
                  <td>{fault.poleId}</td>
                  <td>{fault.zoneId}</td>
                  <td>
                    <span className={`pill ${fault.severity.toLowerCase()}`}>
                      {fault.severity}
                    </span>
                  </td>
                  <td>{fault.detectedAt}</td>
                  <td>{fault.status}</td>
                  <td>
                    <button
                      type="button"
                      className="ghost-btn"
                      onClick={() => setSelectedFaultId(fault.faultId)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <SideDrawer
        title="Fault Details"
        subtitle={selectedFault?.faultId}
        isOpen={Boolean(selectedFault)}
        onClose={() => setSelectedFaultId(null)}
      >
        {selectedFault ? (
          <div className="drawer-grid">
            <div>
              <span>Zone</span>
              <strong>{selectedFault.zoneId}</strong>
            </div>
            <div>
              <span>Pole</span>
              <strong>{selectedFault.poleId}</strong>
            </div>
            <div>
              <span>Severity</span>
              <strong>{selectedFault.severity}</strong>
            </div>
            <div>
              <span>Status</span>
              <strong>{selectedFault.status}</strong>
            </div>
            <div>
              <span>Detected At</span>
              <strong>{selectedFault.detectedAt}</strong>
            </div>
            <div>
              <span>Fault Code</span>
              <strong>{selectedFault.faultCode}</strong>
            </div>
            <div>
              <span>Resolution</span>
              <strong>{selectedFault.resolvedAt ?? "Pending"}</strong>
            </div>
          </div>
        ) : null}
      </SideDrawer>
    </div>
  );
}
