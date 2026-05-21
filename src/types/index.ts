export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

export interface EnergyLog {
  id: string;
  userId: string;
  deviceName: string;
  category: string;
  wattage: number;
  duration: number; // in minutes
  timestamp: Date;
  carbonEmission: number; // in kg CO2
}

export interface DashboardStats {
  totalEnergyToday: number;
  totalCarbonToday: number;
  totalEnergyWeek: number;
  totalCarbonWeek: number;
  totalEnergyMonth: number;
  totalCarbonMonth: number;
  totalEnergyYear: number;
  totalCarbonYear: number;
  topDevices: { name: string; usage: number; carbon: number; category: string }[];
  categoryBreakdown: { category: string; percentage: number; energy: number }[];
}



export const TIME_INTERVALS = [
  { value: 0, label: 'Custom' },
  { value: 60, label: '1 hour' },
  { value: 120, label: '2 hours' },
  { value: 180, label: '3 hours' },
  { value: 240, label: '4 hours' },
  { value: 300, label: '5 hours' },
  { value: 360, label: '6 hours' },
  { value: 420, label: '7 hours' },
  { value: 480, label: '8 hours' },
  { value: 540, label: '9 hours' },
  { value: 600, label: '10 hours' },
  { value: 660, label: '11 hours' },
  { value: 720, label: '12 hours' },
];

// Default carbon emission factor (kg CO2 per kWh) - Philippines grid average (DOE).
// The active factor is sourced from the `emission_factors` table at runtime
// via DevicesContext / EnergyContext; this remains as a fallback for static contexts.
export const CARBON_EMISSION_FACTOR = 0.7;

export function calculateCarbonEmission(
  wattage: number,
  durationMinutes: number,
  factor: number = CARBON_EMISSION_FACTOR,
): number {
  const energyKWh = (wattage * durationMinutes) / (1000 * 60);
  return energyKWh * factor;
}

export function calculateEnergyKWh(wattage: number, durationMinutes: number): number {
  return (wattage * durationMinutes) / (1000 * 60);
}
