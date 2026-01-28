"use client";

import { useMemo, useState } from "react";
import FilterBar from "@/components/filter-bar";
import SideDrawer from "@/components/side-drawer";
import Sparkline from "@/components/sparkline";
import { mockData } from "@/data/mock-data";
import { getAvgResponseTimeMinutes, getSlaCompliancePct } from "@/lib/kpis";

const toDate = (value: string) => (value ? new Date(value).getTime() : null);

export default function MaintenanceSlaPage() {
  const { maintenanceTickets, faults, zones } = mockData;
  const [filters, setFilters] = useState({
    zone: "",
    status: "",
    severity: "",
    startDate: "",
    endDate: "",
  });
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  const faultsById = useMemo(
    () => new Map(faults.map((fault) => [fault.faultId, fault])),
    [faults]
  );

  const filteredTickets = useMemo(() => {
    const start = toDate(filters.startDate);
    const end = toDate(filters.endDate);

    return maintenanceTickets.filter((ticket) => {
      const fault = faultsById.get(ticket.faultId);
      const zoneId = fault?.zoneId;
      const severity = fault?.severity;

      if (filters.zone && zoneId !== filters.zone) return false;
      if (filters.status && ticket.status !== filters.status) return false;
      if (filters.severity && severity !== filters.severity) return false;

      const created = new Date(ticket.createdAt).getTime();
      if (start && created < start) return false;
      if (end && created > end + 86400000) return false;

      return true;
    });
  }, [faultsById, maintenanceTickets, filters]);

  const avgResponse = getAvgResponseTimeMinutes(mockData);
  const slaCompliance = getSlaCompliancePct(mockData);

  const selectedTicket = maintenanceTickets.find(
    (ticket) => ticket.ticketId === selectedTicketId
  );
  const selectedFault = selectedTicket ? faultsById.get(selectedTicket.faultId) : null;

  return (
    <div className="page">
      <section className="page-header">
        <div>
          <span className="inline-tag">Maintenance & SLA</span>
          <h1>Ticket Workflow & Compliance</h1>
          <p>Track response times, closures, and SLA adherence.</p>
        </div>
      </section>

      <FilterBar
        zoneOptions={zones.map((zone) => ({ label: zone.name, value: zone.zoneId }))}
        statusOptions={[
          { label: "Open", value: "OPEN" },
          { label: "In Progress", value: "IN_PROGRESS" },
          { label: "Closed", value: "CLOSED" },
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
          <p className="kpi-label">Avg Response</p>
          <p className="kpi-value">{avgResponse.toFixed(0)} min</p>
          <Sparkline data={[48, 42, 40, 36, 32, 28, 26]} />
        </div>
        <div className="kpi-card">
          <p className="kpi-label">SLA Compliance</p>
          <p className="kpi-value">{slaCompliance.toFixed(1)}%</p>
          <Sparkline data={[92, 94, 95, 96, 97, 96, 98]} />
        </div>
      </section>

      <section className="table-card">
        <header>
          <h2>Maintenance Tickets</h2>
          <p>Active and resolved tickets across zones.</p>
        </header>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Ticket</th>
                <th>Fault</th>
                <th>Zone</th>
                <th>Severity</th>
                <th>Assigned To</th>
                <th>Created</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map((ticket) => {
                const fault = faultsById.get(ticket.faultId);
                const severityClass = fault?.severity
                  ? fault.severity.toLowerCase()
                  : "low";
                return (
                  <tr key={ticket.ticketId}>
                    <td>{ticket.ticketId}</td>
                    <td>{ticket.faultId}</td>
                    <td>{fault?.zoneId ?? "—"}</td>
                    <td>
                      <span className={`pill ${severityClass}`}>{fault?.severity ?? "—"}</span>
                    </td>
                    <td>{ticket.assignedTo}</td>
                    <td>{ticket.createdAt}</td>
                    <td>
                      <span className={`pill ${ticket.status.toLowerCase()}`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="ghost-btn"
                        onClick={() => setSelectedTicketId(ticket.ticketId)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <SideDrawer
        title="Ticket Details"
        subtitle={selectedTicket?.ticketId}
        isOpen={Boolean(selectedTicket)}
        onClose={() => setSelectedTicketId(null)}
      >
        {selectedTicket ? (
          <div className="drawer-grid">
            <div>
              <span>Ticket</span>
              <strong>{selectedTicket.ticketId}</strong>
            </div>
            <div>
              <span>Fault</span>
              <strong>{selectedTicket.faultId}</strong>
            </div>
            <div>
              <span>Zone</span>
              <strong>{selectedFault?.zoneId ?? "—"}</strong>
            </div>
            <div>
              <span>Severity</span>
              <strong>{selectedFault?.severity ?? "—"}</strong>
            </div>
            <div>
              <span>Assigned To</span>
              <strong>{selectedTicket.assignedTo}</strong>
            </div>
            <div>
              <span>Created</span>
              <strong>{selectedTicket.createdAt}</strong>
            </div>
            <div>
              <span>Responded</span>
              <strong>{selectedTicket.respondedAt ?? "—"}</strong>
            </div>
            <div>
              <span>Closed</span>
              <strong>{selectedTicket.closedAt ?? "—"}</strong>
            </div>
            <div>
              <span>SLA (hrs)</span>
              <strong>{selectedTicket.slaHours}</strong>
            </div>
            <div>
              <span>Status</span>
              <strong>{selectedTicket.status}</strong>
            </div>
          </div>
        ) : null}
      </SideDrawer>
    </div>
  );
}
