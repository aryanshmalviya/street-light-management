import type { DataStore } from "@/types/data";

const MS_IN_MIN = 60 * 1000;
const MS_IN_HOUR = 60 * MS_IN_MIN;

const diffMinutes = (start?: string, end?: string) => {
  if (!start || !end) return null;
  return Math.max(0, (new Date(end).getTime() - new Date(start).getTime()) / MS_IN_MIN);
};

const diffHours = (start?: string, end?: string) => {
  if (!start || !end) return null;
  return Math.max(0, (new Date(end).getTime() - new Date(start).getTime()) / MS_IN_HOUR);
};

export const getLatestTimestamp = (store: DataStore) => {
  const timestamps = store.telemetry.map((item) => item.timestamp);
  return timestamps.sort().at(-1) ?? null;
};

export const getZoneEnergy = (store: DataStore) => {
  return store.energySummary.reduce(
    (acc, item) => {
      acc.totalEnergyKwh += item.totalEnergyKwh;
      acc.baselineKwh += item.baselineKwh;
      acc.savingsKwh += item.savingsKwh;
      acc.co2SavedKg += item.co2SavedKg;
      return acc;
    },
    { totalEnergyKwh: 0, baselineKwh: 0, savingsKwh: 0, co2SavedKg: 0 }
  );
};

export const getActiveFaults = (store: DataStore) =>
  store.faults.filter((fault) => fault.status === "OPEN");

export const getUptimePct = (store: DataStore) => {
  const telemetryByPole = new Map(store.telemetry.map((item) => [item.poleId, item]));
  if (telemetryByPole.size === 0) return 0;
  const downCount = Array.from(telemetryByPole.values()).filter(
    (item) => item.state === "FAULT"
  ).length;
  return ((telemetryByPole.size - downCount) / telemetryByPole.size) * 100;
};

export const getSlaCompliancePct = (store: DataStore) => {
  const closedTickets = store.maintenanceTickets.filter((ticket) => ticket.closedAt);
  if (closedTickets.length === 0) return 0;
  const withinSla = closedTickets.filter((ticket) => {
    const hours = diffHours(ticket.createdAt, ticket.closedAt);
    return hours !== null && hours <= ticket.slaHours;
  });
  return (withinSla.length / closedTickets.length) * 100;
};

export const getAvgResponseTimeMinutes = (store: DataStore) => {
  const responseTimes = store.maintenanceTickets
    .map((ticket) => diffMinutes(ticket.createdAt, ticket.respondedAt))
    .filter((value): value is number => value !== null);
  if (responseTimes.length === 0) return 0;
  return responseTimes.reduce((sum, value) => sum + value, 0) / responseTimes.length;
};

export const getPoleStatus = (store: DataStore, poleId: string) =>
  store.telemetry.find((item) => item.poleId === poleId);

export const getPoleFault = (store: DataStore, poleId: string) =>
  store.faults.find((fault) => fault.poleId === poleId && fault.status === "OPEN");

export const getTicketForFault = (store: DataStore, faultId?: string) =>
  store.maintenanceTickets.find((ticket) => ticket.faultId === faultId);
