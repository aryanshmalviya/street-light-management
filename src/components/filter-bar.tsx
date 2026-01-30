"use client";

import type { ReactElement } from "react";

type FilterOption = { label: string; value: string };

type FilterBarProps = {
  zoneOptions: FilterOption[];
  statusOptions: FilterOption[];
  severityOptions?: FilterOption[];
  filters: {
    zone: string;
    status: string;
    severity: string;
    startDate: string;
    endDate: string;
  };
  onChange: (next: FilterBarProps["filters"]) => void;
  onReset?: () => void;
};

export default function FilterBar({
  zoneOptions,
  statusOptions,
  severityOptions,
  filters,
  onChange,
  onReset,
}: FilterBarProps): ReactElement {
  const today = (() => {
    const now = new Date();
    const offsetMs = now.getTimezoneOffset() * 60000;
    return new Date(now.getTime() - offsetMs).toISOString().split("T")[0];
  })();

  return (
    <div className="filter-bar">
      <label className="filter-field">
        <span>Zone</span>
        <select
          value={filters.zone}
          onChange={(event) => onChange({ ...filters, zone: event.target.value })}
        >
          <option value="">All Zones</option>
          {zoneOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      {statusOptions.length > 0 ? (
        <label className="filter-field">
          <span>Status</span>
          <select
            value={filters.status}
            onChange={(event) => onChange({ ...filters, status: event.target.value })}
          >
            <option value="">All Status</option>
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      {severityOptions ? (
        <label className="filter-field">
          <span>Severity</span>
          <select
            value={filters.severity}
            onChange={(event) => onChange({ ...filters, severity: event.target.value })}
          >
            <option value="">All Severity</option>
            {severityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      <label className="filter-field">
        <span>Date (Start)</span>
        <input
          type="date"
          value={filters.startDate}
          max={today}
          onChange={(event) => onChange({ ...filters, startDate: event.target.value })}
        />
      </label>

      <label className="filter-field">
        <span>Date (End)</span>
        <input
          type="date"
          value={filters.endDate}
          max={today}
          onChange={(event) => onChange({ ...filters, endDate: event.target.value })}
        />
      </label>
      
      <div className="filter-actions">
        <button type="button" className="ghost-btn" onClick={onReset} disabled={!onReset}>
          Reset
        </button>
        <button type="button" className="primary-btn">
          Export
        </button>
      </div>
    </div>
  );
}
