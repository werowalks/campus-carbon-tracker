import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { DashboardStats, calculateCarbonEmission, calculateEnergyKWh } from '@/types';

export interface EnergyLog {
  id: string;
  user_id: string;
  device_name: string;
  category: string;
  wattage: number;
  duration: number; // in minutes
  timestamp: Date;
  carbon_emission: number; // in kg CO2
}

interface EnergyContextType {
  logs: EnergyLog[];
  isLoading: boolean;
  addLog: (log: Omit<EnergyLog, 'id' | 'carbon_emission' | 'user_id'>) => Promise<void>;
  updateLog: (id: string, updates: Partial<Pick<EnergyLog, 'device_name' | 'category' | 'wattage' | 'duration'>>) => Promise<void>;
  deleteLog: (id: string) => Promise<void>;
  getStats: (userId?: string, period?: 'today' | 'week' | 'month' | 'year') => DashboardStats;
  getAllLogs: () => EnergyLog[];
  refreshLogs: () => Promise<void>;
}

const EnergyContext = createContext<EnergyContextType | undefined>(undefined);

export function EnergyProvider({ children }: { children: ReactNode }) {
  const [logs, setLogs] = useState<EnergyLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAdmin } = useAuth();

  const fetchLogs = useCallback(async () => {
    if (!user) {
      setLogs([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('energy_logs')
        .select('*')
        .order('timestamp', { ascending: false });

      if (error) {
        console.error('Error fetching logs:', error);
        return;
      }

      const formattedLogs: EnergyLog[] = (data || []).map((log) => ({
        id: log.id,
        user_id: log.user_id,
        device_name: log.device_name,
        category: log.category,
        wattage: log.wattage,
        duration: log.duration,
        timestamp: new Date(log.timestamp),
        carbon_emission: Number(log.carbon_emission),
      }));

      setLogs(formattedLogs);
    } catch (error) {
      console.error('Error in fetchLogs:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const addLog = async (logData: Omit<EnergyLog, 'id' | 'carbon_emission' | 'user_id'>) => {
    if (!user) {
      console.error('No user logged in');
      return;
    }

    const carbonEmission = calculateCarbonEmission(logData.wattage, logData.duration);

    const { data, error } = await supabase
      .from('energy_logs')
      .insert({
        user_id: user.id,
        device_name: logData.device_name,
        category: logData.category,
        wattage: logData.wattage,
        duration: logData.duration,
        carbon_emission: carbonEmission,
        timestamp: logData.timestamp.toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding log:', error);
      throw error;
    }

    if (data) {
      const newLog: EnergyLog = {
        id: data.id,
        user_id: data.user_id,
        device_name: data.device_name,
        category: data.category,
        wattage: data.wattage,
        duration: data.duration,
        timestamp: new Date(data.timestamp),
        carbon_emission: Number(data.carbon_emission),
      };
      setLogs(prev => [newLog, ...prev]);
    }
  };

  const updateLog = async (id: string, updates: Partial<Pick<EnergyLog, 'device_name' | 'category' | 'wattage' | 'duration'>>) => {
    const existing = logs.find(log => log.id === id);
    if (!existing) throw new Error('Log not found');

    const newWattage = updates.wattage ?? existing.wattage;
    const newDuration = updates.duration ?? existing.duration;
    const newCarbonEmission = calculateCarbonEmission(newWattage, newDuration);

    const { error } = await supabase
      .from('energy_logs')
      .update({
        ...updates,
        carbon_emission: newCarbonEmission,
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating log:', error);
      throw error;
    }

    setLogs(prev => prev.map(log =>
      log.id === id
        ? { ...log, ...updates, carbon_emission: newCarbonEmission }
        : log
    ));
  };

  const deleteLog = async (id: string) => {
    const { error } = await supabase
      .from('energy_logs')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting log:', error);
      throw error;
    }

    setLogs(prev => prev.filter(log => log.id !== id));
  };

  const getStats = (userId?: string, period: 'today' | 'week' | 'month' | 'year' = 'month'): DashboardStats => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(todayStart.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const yearStart = new Date(now.getFullYear(), 0, 1);

    // Filter logs by user if specified, otherwise use all (for admin view)
    const filteredLogs = userId ? logs.filter(log => log.user_id === userId) : logs;

    const todayLogs = filteredLogs.filter(log => new Date(log.timestamp) >= todayStart);
    const weekLogs = filteredLogs.filter(log => new Date(log.timestamp) >= weekStart);
    const monthLogs = filteredLogs.filter(log => new Date(log.timestamp) >= monthStart);
    const yearLogs = filteredLogs.filter(log => new Date(log.timestamp) >= yearStart);

    const calculateTotals = (logList: EnergyLog[]) => ({
      energy: logList.reduce((sum, log) => sum + calculateEnergyKWh(log.wattage, log.duration), 0),
      carbon: logList.reduce((sum, log) => sum + log.carbon_emission, 0),
    });

    const todayTotals = calculateTotals(todayLogs);
    const weekTotals = calculateTotals(weekLogs);
    const monthTotals = calculateTotals(monthLogs);
    const yearTotals = calculateTotals(yearLogs);

    // Select logs for top devices and category breakdown based on period
    const periodLogs =
      period === 'today' ? todayLogs :
      period === 'week' ? weekLogs :
      period === 'year' ? yearLogs :
      monthLogs;

    // Top devices (aggregate energy + carbon, return up to 10)
    const deviceUsage: Record<string, { usage: number; carbon: number; category: string }> = {};
    periodLogs.forEach(log => {
      if (!deviceUsage[log.device_name]) {
        deviceUsage[log.device_name] = { usage: 0, carbon: 0, category: log.category };
      }
      deviceUsage[log.device_name].usage += calculateEnergyKWh(log.wattage, log.duration);
      deviceUsage[log.device_name].carbon += log.carbon_emission;
    });

    const topDevices = Object.entries(deviceUsage)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.usage - a.usage);

    // Category breakdown
    const categoryUsage: Record<string, number> = {};
    periodLogs.forEach(log => {
      if (!categoryUsage[log.category]) {
        categoryUsage[log.category] = 0;
      }
      categoryUsage[log.category] += calculateEnergyKWh(log.wattage, log.duration);
    });

    const totalEnergy = Object.values(categoryUsage).reduce((sum, val) => sum + val, 0);
    const categoryBreakdown = Object.entries(categoryUsage).map(([category, energy]) => ({
      category,
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
      totalEnergyYear: yearTotals.energy,
      totalCarbonYear: yearTotals.carbon,
      topDevices,
      categoryBreakdown,
    };
  };

  const getAllLogs = () => logs;

  const refreshLogs = async () => {
    await fetchLogs();
  };

  return (
    <EnergyContext.Provider value={{ logs, isLoading, addLog, updateLog, deleteLog, getStats, getAllLogs, refreshLogs }}>
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
