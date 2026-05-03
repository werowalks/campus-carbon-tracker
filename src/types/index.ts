export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

export interface DeviceCategory {
  id: string;
  name: string;
  icon: string;
  avgWattage: number;
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

export const DEVICE_CATEGORIES: DeviceCategory[] = [
  { id: 'computer', name: 'Computing', icon: 'laptop', avgWattage: 150 },
  { id: 'hvac', name: 'HVAC', icon: 'thermometer', avgWattage: 1500 },
  { id: 'lighting', name: 'Lighting', icon: 'lightbulb', avgWattage: 60 },
  { id: 'projector', name: 'Presentation', icon: 'projector', avgWattage: 300 },
  { id: 'printer', name: 'Printing', icon: 'printer', avgWattage: 500 },
  { id: 'lab', name: 'Laboratory', icon: 'flask-conical', avgWattage: 800 },
  { id: 'kitchen', name: 'Pantry', icon: 'utensils', avgWattage: 1000 },
];

export const TIME_INTERVALS = [
  { value: 15, label: '15 minutes' },
  { value: 30, label: '30 minutes' },
  { value: 45, label: '45 minutes' },
  { value: 60, label: '1 hour' },
  { value: 90, label: '1.5 hours' },
  { value: 120, label: '2 hours' },
  { value: 180, label: '3 hours' },
  { value: 240, label: '4 hours' },
  { value: 480, label: '8 hours' },
  { value: 0, label: 'Custom' },
];

// Carbon emission factor (kg CO2 per kWh) - Philippines grid average
export const CARBON_EMISSION_FACTOR = 0.7;

export function calculateCarbonEmission(wattage: number, durationMinutes: number): number {
  const energyKWh = (wattage * durationMinutes) / (1000 * 60);
  return energyKWh * CARBON_EMISSION_FACTOR;
}

export function calculateEnergyKWh(wattage: number, durationMinutes: number): number {
  return (wattage * durationMinutes) / (1000 * 60);
}
