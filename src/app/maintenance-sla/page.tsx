"use client";

import { useEffect, useState } from "react";
import FilterBar from "@/components/filter-bar";
import SideDrawer from "@/components/side-drawer";
import Sparkline from "@/components/sparkline";
import { mockData } from "@/data/mock-data";
import { getAvgResponseTimeMinutes, getSlaCompliancePct } from "@/lib/kpis";

export default function MaintenanceSlaPage() {
  const [filters, setFilters] = useState({
    zone: "",
    status: "",
    severity: "",
    startDate: "",
    endDate: "",
  });
  const [limit, setLimit] = useState("50");
  const [apiZones, setApiZones] = useState<
    {
      zone_id: string;
      name: string;
    }[]
  >([]);
  const [zonesLoading, setZonesLoading] = useState(true);
  const [zonesError, setZonesError] = useState<string | null>(null);
  const [tickets, setTickets] = useState<
    {
      ticket_id: string;
      fault_id: string | null;
      assigned_to: string | null;
      created_at: string;
      sla_hours: number | null;
      status: string;
      ticket_desc: string | null;
      pole_id: string | null;
      zone_id: string | null;
      assigned_to_name: string | null;
    }[]
  >([]);
  const [ticketsLoading, setTicketsLoading] = useState(false);
  const [ticketsError, setTicketsError] = useState<string | null>(null);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

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
          data?: { zone_id: string; name: string }[];
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

  useEffect(() => {
    const loadTickets = async () => {
      try {
        setTicketsLoading(true);
        setTicketsError(null);
        const queryParts: string[] = [];
        queryParts.push(`zoneId=${encodeURIComponent(filters.zone || "all")}`);
        queryParts.push(`limit=${encodeURIComponent(limit)}`);
        queryParts.push(`status=${encodeURIComponent(filters.status || "all")}`);
        if (filters.startDate) {
          queryParts.push(
            `start_date=${encodeURIComponent(new Date(filters.startDate).toISOString())}`
          );
        }
        if (filters.endDate) {
          queryParts.push(
            `end_date=${encodeURIComponent(new Date(filters.endDate).toISOString())}`
          );
        }
        const response = await fetch(
          `http://localhost:3000/api/maintenance/pending?${queryParts.join("&")}`
        );
        if (!response.ok) {
          throw new Error(`Failed to load tickets: ${response.status}`);
        }
        const payload = (await response.json()) as {
          success?: boolean;
          data?: {
            ticket_id: string;
            fault_id: string | null;
            assigned_to: string | null;
            created_at: string;
            sla_hours: number | null;
            status: string;
            ticket_desc: string | null;
            pole_id: string | null;
            zone_id: string | null;
            assigned_to_name: string | null;
          }[];
        };
        if (!payload.success || !payload.data) {
          throw new Error("Invalid maintenance response");
        }
        setTickets(payload.data);
      } catch (error) {
        setTicketsError(error instanceof Error ? error.message : "Failed to load tickets");
      } finally {
        setTicketsLoading(false);
      }
    };
    loadTickets();
  }, [filters.endDate, filters.startDate, filters.status, filters.zone, limit]);

  const avgResponse = getAvgResponseTimeMinutes(mockData);
  const slaCompliance = getSlaCompliancePct(mockData);

  const selectedTicket = tickets.find((ticket) => ticket.ticket_id === selectedTicketId);

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
        zoneOptions={apiZones.map((zone) => ({ label: zone.name, value: zone.zone_id }))}
        statusOptions={[
          { label: "Pending", value: "pending" },
          { label: "Assigned", value: "assigned" },
          { label: "In Progress", value: "in_progress" },
          { label: "Complete", value: "complete" },
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
        <header className="table-header">
          <div>
            <h2>Maintenance Tickets</h2>
            <p>Active and resolved tickets across zones.</p>
          </div>
          <label className="filter-field">
            <span>Limit</span>
            <select value={limit} onChange={(event) => setLimit(event.target.value)}>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </label>
        </header>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Ticket</th>
                <th>Zone</th>
                <th>Pole</th>
                <th>Description</th>
                <th>Created</th>
                <th>SLA (hrs)</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {ticketsLoading ? (
                <tr>
                  <td colSpan={8}>Loading tickets…</td>
                </tr>
              ) : ticketsError ? (
                <tr>
                  <td colSpan={8}>{ticketsError}</td>
                </tr>
              ) : tickets.length === 0 ? (
                <tr>
                  <td colSpan={8}>No tickets found.</td>
                </tr>
              ) : (
                tickets.map((ticket) => (
                  <tr key={ticket.ticket_id}>
                    <td>
                      <span className="truncate-id" title={ticket.ticket_id}>
                        {ticket.ticket_id}
                      </span>
                    </td>
                    <td>
                      <span className="truncate-id" title={ticket.zone_id ?? ""}>
                        {ticket.zone_id ?? "—"}
                      </span>
                    </td>
                    <td>
                      <span className="truncate-id" title={ticket.pole_id ?? ""}>
                        {ticket.pole_id ?? "—"}
                      </span>
                    </td>
                    <td>{ticket.ticket_desc ?? "—"}</td>
                    <td>{ticket.created_at}</td>
                    <td>{ticket.sla_hours ?? "—"}</td>
                    <td>
                      <span className={`pill ${ticket.status.toLowerCase()}`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="ghost-btn"
                        onClick={() => setSelectedTicketId(ticket.ticket_id)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
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
              <strong>{selectedTicket.ticket_id}</strong>
            </div>
            <div>
              <span>Zone</span>
              <strong>{selectedTicket.zone_id ?? "—"}</strong>
            </div>
            <div>
              <span>Pole</span>
              <strong>{selectedTicket.pole_id ?? "—"}</strong>
            </div>
            <div>
              <span>Created</span>
              <strong>{selectedTicket.created_at}</strong>
            </div>
            <div>
              <span>SLA (hrs)</span>
              <strong>{selectedTicket.sla_hours ?? "—"}</strong>
            </div>
            <div>
              <span>Status</span>
              <strong>{selectedTicket.status}</strong>
            </div>
            <div>
              <span>Description</span>
              <strong>{selectedTicket.ticket_desc ?? "—"}</strong>
            </div>
          </div>
        ) : null}
      </SideDrawer>
    </div>
  );
}
