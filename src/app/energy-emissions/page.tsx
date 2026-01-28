"use client";

import { useMemo, useState } from "react";
import BarChart from "@/components/bar-chart";
import FilterBar from "@/components/filter-bar";
import { mockData } from "@/data/mock-data";

const toDate = (value: string) => (value ? new Date(value).getTime() : null);

export default function EnergyEmissionsPage() {
  const { energySummary, zones } = mockData;
  const [filters, setFilters] = useState({
    zone: "",
    status: "",
    severity: "",
    startDate: "",
    endDate: "",
  });

  const filteredEnergy = useMemo(() => {
    const start = toDate(filters.startDate);
    const end = toDate(filters.endDate);

    return energySummary.filter((row) => {
      if (filters.zone && row.zoneId !== filters.zone) return false;

      const entryDate = new Date(row.date).getTime();
      if (start && entryDate < start) return false;
      if (end && entryDate > end + 86400000) return false;

      return true;
    });
  }, [energySummary, filters]);

  const chartData = filteredEnergy.map((row) => ({
    label: row.zoneId.replace("NH44-", ""),
    value: row.totalEnergyKwh,
    color: "#4f7cff",
  }));

  const baselineData = filteredEnergy.map((row) => ({
    label: row.zoneId.replace("NH44-", ""),
    value: row.baselineKwh,
    color: "#9fb6ff",
  }));

  return (
    <div className="page">
      <section className="page-header">
        <div>
          <span className="inline-tag">Energy & Emissions</span>
          <h1>Energy Optimization Snapshot</h1>
          <p>Baseline vs optimized energy usage with CO₂ impact.</p>
        </div>
      </section>

      <FilterBar
        zoneOptions={zones.map((zone) => ({ label: zone.name, value: zone.zoneId }))}
        statusOptions={[]}
        filters={filters}
        onChange={setFilters}
        onReset={() =>
          setFilters({ zone: "", status: "", severity: "", startDate: "", endDate: "" })
        }
      />

      <section className="chart-card">
        <header>
          <h2>Energy Usage by Zone</h2>
          <p>Actual vs baseline kWh (assumed data).</p>
        </header>
        <div className="chart-grid">
          <div>
            <span className="chart-label">Actual</span>
            <BarChart data={chartData} />
          </div>
          <div>
            <span className="chart-label">Baseline</span>
            <BarChart data={baselineData} />
          </div>
        </div>
      </section>

      <section className="table-card">
        <header>
          <h2>Daily Summary</h2>
          <p>Calculated using assumed baseline data.</p>
        </header>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Zone</th>
                <th>Date</th>
                <th>Total Energy (kWh)</th>
                <th>Baseline (kWh)</th>
                <th>Savings (kWh)</th>
                <th>CO₂ Saved (kg)</th>
              </tr>
            </thead>
            <tbody>
              {filteredEnergy.map((row) => (
                <tr key={`${row.zoneId}-${row.date}`}>
                  <td>{row.zoneId}</td>
                  <td>{row.date}</td>
                  <td>{row.totalEnergyKwh.toFixed(1)}</td>
                  <td>{row.baselineKwh.toFixed(1)}</td>
                  <td>{row.savingsKwh.toFixed(1)}</td>
                  <td>{row.co2SavedKg.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
