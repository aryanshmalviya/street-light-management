import type { Asset, Controller, DataStore, Fault, Telemetry, Zone } from "@/types/data";
const METERS_PER_DEG_LAT = 111_320;

const buildLinePoints = (
  latitude: number,
  longitude: number,
  lengthMeters: number,
  count: number,
  bearingDeg: number
) => {
  const latRad = (latitude * Math.PI) / 180;
  const bearingRad = (bearingDeg * Math.PI) / 180;
  const spacing = count > 1 ? lengthMeters / (count - 1) : 0;
  const startOffset = -((count - 1) / 2) * spacing;

  return Array.from({ length: count }, (_, index) => {
    const offset = startOffset + index * spacing;
    const latOffset = (offset * Math.cos(bearingRad)) / METERS_PER_DEG_LAT;
    const lngOffset =
      (offset * Math.sin(bearingRad)) / (METERS_PER_DEG_LAT * Math.max(0.0001, Math.cos(latRad)));
    return {
      lat: latitude + latOffset,
      lng: longitude + lngOffset,
    };
  });
};

const pad3 = (value: number) => String(value).padStart(3, "0");

const buildAssets = (zones: Zone[]) => {
  const fixtureTypes = ["LED-120W", "LED-90W"];
  const bearings = [35, 115];
  return zones.flatMap((zone, zoneIndex) => {
    const count = zone.poles;
    const start = zoneIndex === 0 ? 1 : 101;
    const lineLengthMeters = zone.lengthKm * 1000;
    const points = buildLinePoints(
      zone.latitude,
      zone.longitude,
      lineLengthMeters,
      count,
      bearings[zoneIndex % bearings.length]
    );

    return Array.from({ length: count }, (_, index) => {
      const poleNumber = start + index;
      const gps = points[index];
      return {
        poleId: `NH44-P${pad3(poleNumber)}`,
        zoneId: zone.zoneId,
        gps,
        fixtureType: fixtureTypes[(zoneIndex + index) % fixtureTypes.length],
        controllerId: `CTRL-${pad3(poleNumber)}`,
        installedOn: `2024-07-${pad3(2 + index).slice(-2)}`,
        status: "ACTIVE",
      } satisfies Asset;
    });
  });
};

const buildTelemetry = (assets: Asset[], faults: Fault[]) => {
  const openFaults = new Map(
    faults.filter((fault) => fault.status === "OPEN").map((fault) => [fault.poleId, fault])
  );

  return assets.map((asset, index) => {
    const basePower = 100 + (index % 5) * 6;
    const fault = openFaults.get(asset.poleId);
    const state = fault ? "FAULT" : index % 3 === 0 ? "DIMMED" : "ON";
    const powerW = fault ? 4 + (index % 3) : basePower;
    const current = Number((powerW / 230).toFixed(2));
    return {
      poleId: asset.poleId,
      timestamp: `2026-01-27T10:15:${pad3(10 + index).slice(-2)}Z`,
      state,
      voltage: 228.5 + (index % 4) * 0.3,
      current,
      powerW,
      energyKwh: Number((1.8 + (index % 6) * 0.12).toFixed(2)),
      ambientLux: 12 + (index % 10),
      temperatureC: 30.8 + (index % 6) * 0.3,
      faultCode: fault?.faultCode,
    } satisfies Telemetry;
  });
};

const zones: Zone[] = [
  {
    zoneId: "NH44-Z01",
    name: "NH44 Toll Plaza A to B",
    lengthKm: 10,
    latitude: 28.6139,
    longitude: 77.209,
    poles: 8,
  },
  {
    zoneId: "NH44-Z02",
    name: "NH44 Plaza B to C",
    lengthKm: 10,
    latitude: 28.6433,
    longitude: 77.2917,
    poles: 6,
  },
];

const assets = buildAssets(zones);

const faults: Fault[] = [
  {
    faultId: "F-1001",
    poleId: "NH44-P002",
    zoneId: "NH44-Z01",
    faultCode: "LAMP_FAILURE",
    severity: "HIGH",
    detectedAt: "2026-01-27T10:15:10Z",
    status: "OPEN",
  },
  {
    faultId: "F-1002",
    poleId: "NH44-P104",
    zoneId: "NH44-Z02",
    faultCode: "DRIVER_FAILURE",
    severity: "MEDIUM",
    detectedAt: "2026-01-27T10:15:35Z",
    status: "OPEN",
  },
  {
    faultId: "F-0995",
    poleId: "NH44-P005",
    zoneId: "NH44-Z01",
    faultCode: "POWER_DROP",
    severity: "LOW",
    detectedAt: "2026-01-26T21:35:00Z",
    status: "RESOLVED",
    resolvedAt: "2026-01-26T23:10:00Z",
  },
];

const controllers = assets.map((asset, index) => {
  const connectivity = index % 3 === 0 ? "NB-IoT" : "4G";
  return {
    controllerId: asset.controllerId,
    firmware: index % 4 === 0 ? "v1.2.2" : "v1.2.3",
    lastSeen: `2026-01-27T10:15:${pad3(20 + index).slice(-2)}Z`,
    connectivity,
  } satisfies Controller;
});

const telemetry = buildTelemetry(assets, faults);

export const mockData: DataStore = {
  zones,
  assets,
  controllers,
  telemetry,
  faults,
  maintenanceTickets: [
    {
      ticketId: "MT-501",
      faultId: "F-1001",
      assignedTo: "Vendor-Alpha",
      createdAt: "2026-01-27T10:16:00Z",
      respondedAt: "2026-01-27T10:38:00Z",
      closedAt: "2026-01-27T14:20:00Z",
      slaHours: 8,
      status: "IN_PROGRESS",
    },
    {
      ticketId: "MT-498",
      faultId: "F-0995",
      assignedTo: "Vendor-Alpha",
      createdAt: "2026-01-26T21:36:00Z",
      respondedAt: "2026-01-26T21:52:00Z",
      closedAt: "2026-01-26T23:05:00Z",
      slaHours: 6,
      status: "CLOSED",
    },
    {
      ticketId: "MT-497",
      faultId: "F-0989",
      assignedTo: "Vendor-Beta",
      createdAt: "2026-01-25T18:12:00Z",
      respondedAt: "2026-01-25T18:44:00Z",
      closedAt: "2026-01-26T01:05:00Z",
      slaHours: 6,
      status: "CLOSED",
    },
  ],
  energySummary: [
    {
      zoneId: "NH44-Z01",
      date: "2026-01-27",
      totalEnergyKwh: 35.4,
      baselineKwh: 48,
      savingsKwh: 12.6,
      co2SavedKg: 8.7,
    },
    {
      zoneId: "NH44-Z02",
      date: "2026-01-27",
      totalEnergyKwh: 28.9,
      baselineKwh: 36,
      savingsKwh: 7.1,
      co2SavedKg: 5.4,
    },
  ],
  automationRules: [
    {
      ruleId: "AR-01",
      zoneId: "NH44-Z01",
      name: "Night Dimming",
      condition: "After 11 PM",
      action: "Dim to 60%",
      active: true,
    },
    {
      ruleId: "AR-02",
      zoneId: "NH44-Z02",
      name: "Traffic Surge",
      condition: "Traffic > 80%",
      action: "Boost to 100%",
      active: true,
    },
  ],
  users: [
    {
      userId: "U-101",
      name: "Aarav Mehta",
      role: "ADMIN",
      email: "aarav.mehta@nhai.gov",
    },
    {
      userId: "U-102",
      name: "Neha Kapoor",
      role: "MAINTENANCE",
      email: "neha.kapoor@nhai.gov",
    },
  ],
  pilotFramework: {
    pilotId: "Pilot-NH44",
    zoneId: "NH44-Z01",
    kpis: ["Uptime", "Energy Savings", "Response Time"],
    durationMonths: 6,
    successThresholds: {
      uptimePct: 99,
      energySavingsPct: 20,
      responseTimeMinutes: 90,
    },
  },
};
