"use client";

import { useMemo, useState, type ChangeEvent } from "react";

const defaultInputs = {
  baselineKwh: 125000,
  optimizedKwh: 86000,
  gridFactor: 0.82,
  creditPrice: 12,
  periodDays: 30,
  lightingHours: 11,
  luminaires: 1800,
};

const formatNumber = (value: number, digits = 0) =>
  value.toLocaleString("en-IN", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });

export default function EnvironmentalImpactPage() {
  const [inputs, setInputs] = useState(defaultInputs);

  const metrics = useMemo(() => {
    const savingsKwh = Math.max(inputs.baselineKwh - inputs.optimizedKwh, 0);
    const co2SavedKg = savingsKwh * inputs.gridFactor;
    const co2SavedTons = co2SavedKg / 1000;
    const credits = co2SavedTons;
    const creditValue = credits * inputs.creditPrice;
    const dailySavings = savingsKwh / Math.max(inputs.periodDays, 1);
    const annualizedSavings = savingsKwh * (365 / Math.max(inputs.periodDays, 1));
    const avgLoadW =
      inputs.luminaires > 0
        ? (inputs.optimizedKwh * 1000) /
          (inputs.luminaires * inputs.lightingHours * inputs.periodDays)
        : 0;

    return {
      savingsKwh,
      co2SavedKg,
      co2SavedTons,
      credits,
      creditValue,
      dailySavings,
      annualizedSavings,
      avgLoadW,
    };
  }, [inputs]);

  const handleChange = (field: keyof typeof defaultInputs) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = Number(event.target.value);
      setInputs((prev) => ({
        ...prev,
        [field]: Number.isFinite(value) ? value : prev[field],
      }));
    };

  return (
    <div className="page">
      <section className="page-header">
        <div>
          <span className="inline-tag">Phase 6 · Environmental Impact</span>
          <h1>Environmental Impact Calculator</h1>
          <p>Estimate CO2 savings and carbon credit potential.</p>
        </div>
      </section>

      <section className="impact-grid">
        <div className="form-card">
          <header>
            <h2>Scenario Inputs</h2>
            <p className="card-muted">Adjust assumptions for the pilot period.</p>
          </header>
          <div className="input-grid">
            <label className="input-field">
              <span>Baseline energy (kWh)</span>
              <input
                type="number"
                min={0}
                step={1000}
                value={inputs.baselineKwh}
                onChange={handleChange("baselineKwh")}
              />
            </label>
            <label className="input-field">
              <span>Optimized energy (kWh)</span>
              <input
                type="number"
                min={0}
                step={1000}
                value={inputs.optimizedKwh}
                onChange={handleChange("optimizedKwh")}
              />
            </label>
            <label className="input-field">
              <span>Grid emission factor (kg CO2 / kWh)</span>
              <input
                type="number"
                min={0}
                step={0.01}
                value={inputs.gridFactor}
                onChange={handleChange("gridFactor")}
              />
            </label>
            <label className="input-field">
              <span>Carbon credit price (USD / ton)</span>
              <input
                type="number"
                min={0}
                step={1}
                value={inputs.creditPrice}
                onChange={handleChange("creditPrice")}
              />
            </label>
            <label className="input-field">
              <span>Evaluation period (days)</span>
              <input
                type="number"
                min={1}
                step={1}
                value={inputs.periodDays}
                onChange={handleChange("periodDays")}
              />
            </label>
            <label className="input-field">
              <span>Lighting hours per day</span>
              <input
                type="number"
                min={1}
                step={1}
                value={inputs.lightingHours}
                onChange={handleChange("lightingHours")}
              />
            </label>
            <label className="input-field">
              <span>Luminaires in scope</span>
              <input
                type="number"
                min={1}
                step={50}
                value={inputs.luminaires}
                onChange={handleChange("luminaires")}
              />
            </label>
          </div>
          <p className="input-note">
            Emission factor should align with current DISCOM grid mix assumptions.
          </p>
        </div>

        <div className="form-card">
          <header>
            <h2>Derived Outcomes</h2>
            <p className="card-muted">Key outputs from the selected scenario.</p>
          </header>
          <div className="kpi-row">
            <div className="kpi-card">
              <p className="kpi-label">Energy saved</p>
              <p className="kpi-value">{formatNumber(metrics.savingsKwh)}</p>
              <p className="kpi-foot">kWh saved in period</p>
            </div>
            <div className="kpi-card">
              <p className="kpi-label">CO2 saved</p>
              <p className="kpi-value">{formatNumber(metrics.co2SavedTons, 1)}</p>
              <p className="kpi-foot">tons of CO2 avoided</p>
            </div>
            <div className="kpi-card">
              <p className="kpi-label">Credit value</p>
              <p className="kpi-value">${formatNumber(metrics.creditValue, 0)}</p>
              <p className="kpi-foot">estimated credit revenue</p>
            </div>
            <div className="kpi-card">
              <p className="kpi-label">Avg load per pole</p>
              <p className="kpi-value">{formatNumber(metrics.avgLoadW, 1)} W</p>
              <p className="kpi-foot">optimized average</p>
            </div>
          </div>
        </div>
      </section>

      <section className="table-card">
        <header>
          <h2>Impact Summary</h2>
          <p>Annualized projections based on the current scenario.</p>
        </header>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Metric</th>
                <th>Value</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Daily energy savings</td>
                <td>{formatNumber(metrics.dailySavings, 0)} kWh</td>
                <td>Average per day across the pilot period.</td>
              </tr>
              <tr>
                <td>Annualized energy savings</td>
                <td>{formatNumber(metrics.annualizedSavings, 0)} kWh</td>
                <td>Scaled using a 365-day assumption.</td>
              </tr>
              <tr>
                <td>Annualized CO2 savings</td>
                <td>
                  {formatNumber(
                    (metrics.annualizedSavings * inputs.gridFactor) / 1000,
                    1
                  )}{" "}
                  tons
                </td>
                <td>Dependent on grid emission factor.</td>
              </tr>
              <tr>
                <td>Estimated credits</td>
                <td>{formatNumber(metrics.credits, 1)} credits</td>
                <td>1 credit per ton CO2 avoided.</td>
              </tr>
              <tr>
                <td>Estimated credit value</td>
                <td>${formatNumber(metrics.creditValue, 0)}</td>
                <td>Based on price per ton input.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="info-card">
        <h2>Reporting Notes</h2>
        <ul className="bullet-list">
          <li>Calibrate emission factors with verified DISCOM disclosures.</li>
          <li>Use smart meter baselines for verified savings claims.</li>
          <li>Carbon credit eligibility depends on audit and registry rules.</li>
        </ul>
      </section>
    </div>
  );
}
