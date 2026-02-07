import React, { useState, useMemo } from 'react';
import { useEnergy } from '@/contexts/EnergyContext';
import { DEVICE_CATEGORIES, CARBON_EMISSION_FACTOR, calculateEnergyKWh } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TrendingDown, Leaf, Zap, FlaskConical, ArrowRight } from 'lucide-react';

// Renewable grid emission factor (kg CO₂/kWh) — based on DOE PH targets
const RENEWABLE_EMISSION_FACTOR = 0.4;

export default function ScenarioSimulation() {
  const { getAllLogs } = useEnergy();
  const logs = getAllLogs();

  const [reduceElectricity, setReduceElectricity] = useState(false);
  const [useRenewableGrid, setUseRenewableGrid] = useState(false);
  const [removeCategory, setRemoveCategory] = useState(false);
  const [excludedCategory, setExcludedCategory] = useState('');

  // Current month logs
  const monthLogs = useMemo(() => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    return logs.filter(log => new Date(log.timestamp) >= monthStart);
  }, [logs]);

  // Categories present in the data
  const activeCategories = useMemo(() => {
    const cats = new Set(monthLogs.map(l => l.category));
    return DEVICE_CATEGORIES.filter(c => cats.has(c.id));
  }, [monthLogs]);

  // Baseline (current) totals
  const baseline = useMemo(() => {
    const totalEnergy = monthLogs.reduce(
      (sum, log) => sum + calculateEnergyKWh(log.wattage, log.duration),
      0
    );
    const totalCarbon = monthLogs.reduce((sum, log) => sum + log.carbon_emission, 0);
    return { totalEnergy, totalCarbon };
  }, [monthLogs]);

  // Projected totals based on toggled scenarios
  const projected = useMemo(() => {
    let filteredLogs = monthLogs;

    // Scenario 3: Remove a high-energy category
    if (removeCategory && excludedCategory) {
      filteredLogs = filteredLogs.filter(log => log.category !== excludedCategory);
    }

    let totalEnergy = filteredLogs.reduce(
      (sum, log) => sum + calculateEnergyKWh(log.wattage, log.duration),
      0
    );

    // Scenario 1: Reduce electricity by 10%
    if (reduceElectricity) {
      totalEnergy *= 0.9;
    }

    // Scenario 2: Change emission factor
    const emissionFactor = useRenewableGrid ? RENEWABLE_EMISSION_FACTOR : CARBON_EMISSION_FACTOR;
    const totalCarbon = totalEnergy * emissionFactor;

    return { totalEnergy, totalCarbon };
  }, [monthLogs, reduceElectricity, useRenewableGrid, removeCategory, excludedCategory]);

  const energyReduction = baseline.totalEnergy > 0
    ? ((baseline.totalEnergy - projected.totalEnergy) / baseline.totalEnergy) * 100
    : 0;
  const carbonReduction = baseline.totalCarbon > 0
    ? ((baseline.totalCarbon - projected.totalCarbon) / baseline.totalCarbon) * 100
    : 0;

  const anyActive = reduceElectricity || useRenewableGrid || (removeCategory && !!excludedCategory);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-primary" />
            Scenario Simulation — Predictive Modeling
          </CardTitle>
          <CardDescription>
            Toggle scenarios below to project how CO₂ emissions change under different conditions.
            Based on this month's logged data.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Scenario Toggles */}
          <div className="space-y-4">
            {/* Toggle 1 */}
            <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-yellow-500" />
                <div>
                  <Label htmlFor="reduce-electricity" className="text-sm font-medium">
                    Reduce Electricity by 10%
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Simulates a campus-wide 10% energy reduction initiative
                  </p>
                </div>
              </div>
              <Switch
                id="reduce-electricity"
                checked={reduceElectricity}
                onCheckedChange={setReduceElectricity}
              />
            </div>

            {/* Toggle 2 */}
            <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
              <div className="flex items-center gap-3">
                <Leaf className="w-5 h-5 text-green-500" />
                <div>
                  <Label htmlFor="renewable-grid" className="text-sm font-medium">
                    Switch to Renewable Grid
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Changes emission factor from {CARBON_EMISSION_FACTOR} to {RENEWABLE_EMISSION_FACTOR} kg CO₂/kWh
                  </p>
                </div>
              </div>
              <Switch
                id="renewable-grid"
                checked={useRenewableGrid}
                onCheckedChange={setUseRenewableGrid}
              />
            </div>

            {/* Toggle 3 */}
            <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
              <div className="flex items-center gap-3">
                <TrendingDown className="w-5 h-5 text-red-500" />
                <div>
                  <Label htmlFor="remove-category" className="text-sm font-medium">
                    Remove a High-Energy Category
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Simulate phasing out an entire device category from campus
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {removeCategory && (
                  <Select value={excludedCategory} onValueChange={setExcludedCategory}>
                    <SelectTrigger className="w-44 h-8 text-xs">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover z-50">
                      {activeCategories.map(cat => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                <Switch
                  id="remove-category"
                  checked={removeCategory}
                  onCheckedChange={(checked) => {
                    setRemoveCategory(checked);
                    if (!checked) setExcludedCategory('');
                  }}
                />
              </div>
            </div>
          </div>

          {/* Results Comparison */}
          <div className="grid gap-4 md:grid-cols-3">
            {/* Current */}
            <Card className="border-muted">
              <CardHeader className="pb-2">
                <CardDescription className="text-xs uppercase tracking-wider">Current (Baseline)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="text-xs text-muted-foreground">Energy</p>
                  <p className="text-xl font-bold">{baseline.totalEnergy.toFixed(2)} kWh</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">CO₂ Emissions</p>
                  <p className="text-xl font-bold">{baseline.totalCarbon.toFixed(4)} kg</p>
                </div>
              </CardContent>
            </Card>

            {/* Arrow */}
            <div className="hidden md:flex items-center justify-center">
              <ArrowRight className="w-8 h-8 text-muted-foreground/40" />
            </div>

            {/* Projected */}
            <Card className={anyActive ? 'border-primary/50 bg-primary/5' : 'border-muted'}>
              <CardHeader className="pb-2">
                <CardDescription className="text-xs uppercase tracking-wider">
                  {anyActive ? 'Projected (Simulated)' : 'No Scenario Active'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="text-xs text-muted-foreground">Energy</p>
                  <p className="text-xl font-bold">
                    {anyActive ? projected.totalEnergy.toFixed(2) : '—'} {anyActive && 'kWh'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">CO₂ Emissions</p>
                  <p className="text-xl font-bold">
                    {anyActive ? projected.totalCarbon.toFixed(4) : '—'} {anyActive && 'kg'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Reduction Summary */}
          {anyActive && (
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <h4 className="text-sm font-semibold text-green-700 dark:text-green-400 mb-2">
                Projected Reduction
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Energy Saved</p>
                  <p className="text-lg font-bold text-green-600 dark:text-green-400">
                    ↓ {energyReduction.toFixed(1)}%
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(baseline.totalEnergy - projected.totalEnergy).toFixed(2)} kWh less
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Carbon Reduced</p>
                  <p className="text-lg font-bold text-green-600 dark:text-green-400">
                    ↓ {carbonReduction.toFixed(1)}%
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(baseline.totalCarbon - projected.totalCarbon).toFixed(4)} kg CO₂ less
                  </p>
                </div>
              </div>
            </div>
          )}

          {monthLogs.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No energy logs this month. Add some logs to see simulation results.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
