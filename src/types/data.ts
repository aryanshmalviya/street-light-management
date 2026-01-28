export type Zone = {
  zoneId: string;
  name: string;
  lengthKm: number;
  latitude: number;
  longitude: number;
  poles: number;
};

export type Asset = {
  poleId: string;
  zoneId: string;
  gps: { lat: number; lng: number };
  fixtureType: string;
  controllerId: string;
  installedOn: string;
  status: "ACTIVE" | "INACTIVE" | "MAINTENANCE";
};

export type Controller = {
  controllerId: string;
  firmware: string;
  lastSeen: string;
  connectivity: "4G" | "NB-IoT" | "5G" | "LTE-M";
};

export type Telemetry = {
  poleId: string;
  timestamp: string;
  state: "ON" | "OFF" | "DIMMED" | "FAULT";
  voltage: number;
  current: number;
  powerW: number;
  energyKwh: number;
  ambientLux: number;
  temperatureC: number;
  dimmingLevel?: number;
  faultCode?: string;
};

export type Fault = {
  faultId: string;
  poleId: string;
  zoneId: string;
  faultCode: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  detectedAt: string;
  status: "OPEN" | "RESOLVED";
  resolvedAt?: string;
};

export type MaintenanceTicket = {
  ticketId: string;
  faultId: string;
  assignedTo: string;
  createdAt: string;
  respondedAt?: string;
  closedAt?: string;
  slaHours: number;
  status: "OPEN" | "IN_PROGRESS" | "CLOSED";
};

export type EnergySummary = {
  zoneId: string;
  date: string;
  totalEnergyKwh: number;
  baselineKwh: number;
  savingsKwh: number;
  co2SavedKg: number;
};

export type AutomationRule = {
  ruleId: string;
  zoneId: string;
  name: string;
  condition: string;
  action: string;
  active: boolean;
};

export type User = {
  userId: string;
  name: string;
  role: "ADMIN" | "MAINTENANCE" | "VIEWER";
  email: string;
};

export type PilotFramework = {
  pilotId: string;
  zoneId: string;
  kpis: string[];
  durationMonths: number;
  successThresholds: Record<string, number>;
};

export type DataStore = {
  zones: Zone[];
  assets: Asset[];
  controllers: Controller[];
  telemetry: Telemetry[];
  faults: Fault[];
  maintenanceTickets: MaintenanceTicket[];
  energySummary: EnergySummary[];
  automationRules: AutomationRule[];
  users: User[];
  pilotFramework: PilotFramework;
};
