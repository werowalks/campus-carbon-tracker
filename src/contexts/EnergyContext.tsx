import React, { createContext, useContext, useState, ReactNode } from 'react';
import { EnergyLog, DashboardStats, calculateCarbonEmission, calculateEnergyKWh, DEVICE_CATEGORIES } from '@/types';

interface EnergyContextType {
  logs: EnergyLog[];
  addLog: (log: Omit<EnergyLog, 'id' | 'carbonEmission'>) => void;
  deleteLog: (id: string) => void;
  getStats: (userId?: string) => DashboardStats;
  getAllLogs: () => EnergyLog[];
}

const EnergyContext = createContext<EnergyContextType | undefined>(undefined);

// Generate some sample data for demo
const generateSampleData = (): EnergyLog[] => {
  const logs: EnergyLog[] = [];
  const categories = DEVICE_CATEGORIES;
  const now = new Date();

  for (let i = 0; i < 50; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const duration = [15, 30, 60, 120, 240][Math.floor(Math.random() * 5)];
    const wattage = category.avgWattage * (0.8 + Math.random() * 0.4);
    const daysAgo = Math.floor(Math.random() * 30);
    const timestamp = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

    logs.push({
      id: `sample-${i}`,
      userId: Math.random() > 0.5 ? '1' : '2',
      deviceName: `${category.name} Unit ${Math.floor(Math.random() * 10) + 1}`,
      category: category.id,
      wattage: Math.round(wattage),
      duration,
      timestamp,
      carbonEmission: calculateCarbonEmission(wattage, duration),
    });
  }

  return logs;
};

export function EnergyProvider({ children }: { children: ReactNode }) {
  const [logs, setLogs] = useState<EnergyLog[]>(generateSampleData());

  const addLog = (logData: Omit<EnergyLog, 'id' | 'carbonEmission'>) => {
    const carbonEmission = calculateCarbonEmission(logData.wattage, logData.duration);
    const newLog: EnergyLog = {
      ...logData,
      id: Date.now().toString(),
      carbonEmission,
    };
    setLogs(prev => [newLog, ...prev]);
  };

  const deleteLog = (id: string) => {
    setLogs(prev => prev.filter(log => log.id !== id));
  };

  const getStats = (userId?: string): DashboardStats => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(todayStart.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const filteredLogs = userId ? logs.filter(log => log.userId === userId) : logs;

    const todayLogs = filteredLogs.filter(log => new Date(log.timestamp) >= todayStart);
    const weekLogs = filteredLogs.filter(log => new Date(log.timestamp) >= weekStart);
    const monthLogs = filteredLogs.filter(log => new Date(log.timestamp) >= monthStart);

    const calculateTotals = (logList: EnergyLog[]) => ({
      energy: logList.reduce((sum, log) => sum + calculateEnergyKWh(log.wattage, log.duration), 0),
      carbon: logList.reduce((sum, log) => sum + log.carbonEmission, 0),
    });

    const todayTotals = calculateTotals(todayLogs);
    const weekTotals = calculateTotals(weekLogs);
    const monthTotals = calculateTotals(monthLogs);

    // Top devices
    const deviceUsage: Record<string, { usage: number; category: string }> = {};
    monthLogs.forEach(log => {
      if (!deviceUsage[log.deviceName]) {
        deviceUsage[log.deviceName] = { usage: 0, category: log.category };
      }
      deviceUsage[log.deviceName].usage += calculateEnergyKWh(log.wattage, log.duration);
    });

    const topDevices = Object.entries(deviceUsage)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.usage - a.usage)
      .slice(0, 3);

    // Category breakdown
    const categoryUsage: Record<string, number> = {};
    monthLogs.forEach(log => {
      if (!categoryUsage[log.category]) {
        categoryUsage[log.category] = 0;
      }
      categoryUsage[log.category] += calculateEnergyKWh(log.wattage, log.duration);
    });

    const totalEnergy = Object.values(categoryUsage).reduce((sum, val) => sum + val, 0);
    const categoryBreakdown = Object.entries(categoryUsage).map(([category, energy]) => ({
      category: DEVICE_CATEGORIES.find(c => c.id === category)?.name || category,
      percentage: totalEnergy > 0 ? (energy / totalEnergy) * 100 : 0,
      energy,
    }));

    return {
      totalEnergyToday: todayTotals.energy,
      totalCarbonToday: todayTotals.carbon,
      totalEnergyWeek: weekTotals.energy,
      totalCarbonWeek: weekTotals.carbon,
      totalEnergyMonth: monthTotals.energy,
      totalCarbonMonth: monthTotals.carbon,
      topDevices,
      categoryBreakdown,
    };
  };

  const getAllLogs = () => logs;

  return (
    <EnergyContext.Provider value={{ logs, addLog, deleteLog, getStats, getAllLogs }}>
      {children}
    </EnergyContext.Provider>
  );
}

export function useEnergy() {
  const context = useContext(EnergyContext);
  if (context === undefined) {
    throw new Error('useEnergy must be used within an EnergyProvider');
  }
  return context;
}
