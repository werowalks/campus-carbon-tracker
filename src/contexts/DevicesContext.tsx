import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface DBDevice {
  id: string;
  name: string;
  category: string;
  wattage: number;
  source: string | null;
  updated_at: string;
  updated_by: string | null;
}

export interface EmissionFactor {
  id: string;
  factor_kg_per_kwh: number;
  effective_date: string;
  source: string;
  notes: string | null;
  is_active: boolean;
  updated_at: string;
  updated_by: string | null;
}

// Fallback value (used until DB load completes)
const DEFAULT_EMISSION_FACTOR = 0.7;

interface DevicesContextType {
  devices: DBDevice[];
  categories: string[];
  categoryWattage: Record<string, number>;
  emissionFactor: number;
  activeFactorRow: EmissionFactor | null;
  isLoading: boolean;
  getDevicesByCategory: (category: string) => DBDevice[];
  getDeviceByName: (name: string) => DBDevice | undefined;
  refresh: () => Promise<void>;
}

const DevicesContext = createContext<DevicesContextType | undefined>(undefined);

export function DevicesProvider({ children }: { children: ReactNode }) {
  const [devices, setDevices] = useState<DBDevice[]>([]);
  const [activeFactorRow, setActiveFactorRow] = useState<EmissionFactor | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    setIsLoading(true);
    const [{ data: devicesData }, { data: factorData }] = await Promise.all([
      supabase.from('devices').select('*').order('category').order('name'),
      supabase.from('emission_factors').select('*').eq('is_active', true).maybeSingle(),
    ]);
    setDevices((devicesData as DBDevice[]) || []);
    setActiveFactorRow((factorData as EmissionFactor) || null);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const categories = Array.from(new Set(devices.map(d => d.category))).sort();

  const categoryWattage: Record<string, number> = {};
  categories.forEach(cat => {
    const ds = devices.filter(d => d.category === cat);
    if (ds.length > 0) {
      categoryWattage[cat] = Math.round(ds.reduce((s, d) => s + d.wattage, 0) / ds.length);
    }
  });

  return (
    <DevicesContext.Provider
      value={{
        devices,
        categories,
        categoryWattage,
        emissionFactor: activeFactorRow?.factor_kg_per_kwh
          ? Number(activeFactorRow.factor_kg_per_kwh)
          : DEFAULT_EMISSION_FACTOR,
        activeFactorRow,
        isLoading,
        getDevicesByCategory: (category) => devices.filter(d => d.category === category),
        getDeviceByName: (name) => devices.find(d => d.name === name),
        refresh: fetchAll,
      }}
    >
      {children}
    </DevicesContext.Provider>
  );
}

export function useDevices() {
  const ctx = useContext(DevicesContext);
  if (!ctx) throw new Error('useDevices must be used within a DevicesProvider');
  return ctx;
}

// Helper for non-React code (uses live cached factor via callback)
let _liveFactor = DEFAULT_EMISSION_FACTOR;
export function _setLiveFactor(v: number) { _liveFactor = v; }
export function getLiveEmissionFactor() { return _liveFactor; }
