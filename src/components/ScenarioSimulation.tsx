import React, { useState, useMemo } from 'react';
import { useEnergy } from '@/contexts/EnergyContext';
import { useDevices } from '@/contexts/DevicesContext';
import { calculateEnergyKWh } from '@/types';
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
import { TrendingDown, Leaf, Zap, FlaskConical, ArrowRight, Download, FileText, FileSpreadsheet } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

// Renewable grid emission factor (kg CO₂/kWh) — based on DOE PH targets
const RENEWABLE_EMISSION_FACTOR = 0.4;

export default function ScenarioSimulation() {
  const { getAllLogs } = useEnergy();
  const { emissionFactor: CARBON_EMISSION_FACTOR } = useDevices();
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
    const cats = Array.from(new Set(monthLogs.map(l => l.category)));
    return cats.map(cat => ({ id: cat, name: cat }));
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

  const activeScenarios = [
    reduceElectricity && 'Reduce Electricity by 10%',
    useRenewableGrid && `Switch to Renewable Grid (${RENEWABLE_EMISSION_FACTOR} kg CO₂/kWh)`,
    removeCategory && excludedCategory && `Remove Category: ${excludedCategory}`,
  ].filter(Boolean) as string[];

  const exportTimestamp = () => {
    const d = new Date();
    return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}-${String(d.getHours()).padStart(2, '0')}${String(d.getMinutes()).padStart(2, '0')}`;
  };

  const handleExportCSV = () => {
    const rows: (string | number)[][] = [
      ['WattLog — Predictive Modeling Export'],
      ['Generated', new Date().toLocaleString()],
      ['Logs Included (this month)', monthLogs.length],
      ['Baseline Emission Factor (kg CO₂/kWh)', CARBON_EMISSION_FACTOR],
      ['Renewable Emission Factor (kg CO₂/kWh)', RENEWABLE_EMISSION_FACTOR],
      [],
      ['Active Scenarios'],
      ...(activeScenarios.length ? activeScenarios.map(s => [s]) : [['None']]),
      [],
      ['Metric', 'Baseline', 'Projected', 'Reduction (%)'],
      [
        'Energy (kWh)',
        baseline.totalEnergy.toFixed(4),
        (anyActive ? projected.totalEnergy : baseline.totalEnergy).toFixed(4),
        anyActive ? energyReduction.toFixed(2) : '0.00',
      ],
      [
        'CO₂ Emissions (kg)',
        baseline.totalCarbon.toFixed(4),
        (anyActive ? projected.totalCarbon : baseline.totalCarbon).toFixed(4),
        anyActive ? carbonReduction.toFixed(2) : '0.00',
      ],
    ];
    const csv = rows
      .map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wattlog-predictive-${exportTimestamp()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('CSV exported');
  };

  const handleExportPDF = () => {
    const win = window.open('', '_blank');
    if (!win) {
      toast.error('Please allow pop-ups to export PDF');
      return;
    }
    const scenariosHtml = activeScenarios.length
      ? `<ul>${activeScenarios.map(s => `<li>${s}</li>`).join('')}</ul>`
      : '<p><em>No scenarios active — showing baseline only.</em></p>';
    win.document.write(`<!doctype html><html><head><title>WattLog — Predictive Modeling Report</title>
<style>
  body { font-family: -apple-system, system-ui, sans-serif; padding: 32px; color: #111; max-width: 720px; margin: 0 auto; }
  h1 { font-size: 22px; margin: 0 0 4px; }
  h2 { font-size: 15px; margin: 24px 0 8px; color: #166534; }
  .meta { color: #666; font-size: 12px; margin-bottom: 16px; }
  table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 13px; }
  th, td { border: 1px solid #ddd; padding: 8px 10px; text-align: left; }
  th { background: #f0fdf4; }
  .reduction { color: #16a34a; font-weight: 600; }
</style></head><body>
<h1>WattLog — Predictive Modeling Report</h1>
<div class="meta">Generated ${new Date().toLocaleString()} · ${monthLogs.length} logs this month</div>
<h2>Active Scenarios</h2>
${scenariosHtml}
<h2>Results</h2>
<table>
  <thead><tr><th>Metric</th><th>Baseline</th><th>Projected</th><th>Reduction</th></tr></thead>
  <tbody>
    <tr><td>Energy (kWh)</td><td>${baseline.totalEnergy.toFixed(2)}</td><td>${(anyActive ? projected.totalEnergy : baseline.totalEnergy).toFixed(2)}</td><td class="reduction">${anyActive ? energyReduction.toFixed(1) + '%' : '—'}</td></tr>
    <tr><td>CO₂ Emissions (kg)</td><td>${baseline.totalCarbon.toFixed(4)}</td><td>${(anyActive ? projected.totalCarbon : baseline.totalCarbon).toFixed(4)}</td><td class="reduction">${anyActive ? carbonReduction.toFixed(1) + '%' : '—'}</td></tr>
  </tbody>
</table>
<h2>Methodology</h2>
<p style="font-size:12px;color:#444;">Energy (kWh) = (Wattage × Duration min) ÷ 60,000. CO₂ = Energy × emission factor (${CARBON_EMISSION_FACTOR} kg CO₂/kWh baseline DOE PH; ${RENEWABLE_EMISSION_FACTOR} renewable grid). Reduction = (Baseline − Projected) ÷ Baseline × 100.</p>
<script>window.onload = () => { window.print(); }</script>
</body></html>`);
    win.document.close();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-primary" />
                Scenario Simulation — Predictive Modeling
              </CardTitle>
              <CardDescription className="mt-1.5">
                Toggle scenarios below to project how CO₂ emissions change under different conditions.
                Based on this month's logged data.
              </CardDescription>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" disabled={monthLogs.length === 0}>
                  <Download className="w-4 h-4" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-popover z-50">
                <DropdownMenuItem onClick={handleExportCSV}>
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportPDF}>
                  <FileText className="w-4 h-4 mr-2" />
                  Export as PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
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

          {/* Chart Visualization */}
          {baseline.totalEnergy > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Baseline vs Projected Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Energy Chart */}
                  <div>
                    <p className="text-xs text-muted-foreground mb-2 text-center font-medium">Energy (kWh)</p>
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart
                        data={[
                          { name: 'Baseline', value: baseline.totalEnergy },
                          { name: 'Projected', value: anyActive ? projected.totalEnergy : baseline.totalEnergy },
                        ]}
                        margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                        <XAxis dataKey="name" className="text-xs fill-muted-foreground" tick={{ fontSize: 12 }} />
                        <YAxis className="text-xs fill-muted-foreground" tick={{ fontSize: 11 }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--popover))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                            fontSize: '12px',
                            color: 'hsl(var(--popover-foreground))',
                          }}
                          formatter={(value: number) => [`${value.toFixed(2)} kWh`, 'Energy']}
                        />
                        <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={60}>
                          <Cell fill="hsl(var(--primary))" />
                          <Cell fill={anyActive ? 'hsl(142, 71%, 45%)' : 'hsl(var(--muted-foreground))'} />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Carbon Chart */}
                  <div>
                    <p className="text-xs text-muted-foreground mb-2 text-center font-medium">CO₂ Emissions (kg)</p>
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart
                        data={[
                          { name: 'Baseline', value: baseline.totalCarbon },
                          { name: 'Projected', value: anyActive ? projected.totalCarbon : baseline.totalCarbon },
                        ]}
                        margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                        <XAxis dataKey="name" className="text-xs fill-muted-foreground" tick={{ fontSize: 12 }} />
                        <YAxis className="text-xs fill-muted-foreground" tick={{ fontSize: 11 }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--popover))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                            fontSize: '12px',
                            color: 'hsl(var(--popover-foreground))',
                          }}
                          formatter={(value: number) => [`${value.toFixed(4)} kg`, 'CO₂']}
                        />
                        <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={60}>
                          <Cell fill="hsl(var(--primary))" />
                          <Cell fill={anyActive ? 'hsl(142, 71%, 45%)' : 'hsl(var(--muted-foreground))'} />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Legend */}
                <div className="flex items-center justify-center gap-6 mt-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-sm bg-primary" />
                    <span>Baseline</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: anyActive ? 'hsl(142, 71%, 45%)' : 'hsl(var(--muted-foreground))' }} />
                    <span>Projected</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Computation Documentation */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <h4 className="font-semibold text-sm mb-2">💡 How are these computed?</h4>
              <ul className="text-xs text-muted-foreground space-y-1.5">
                <li>
                  • <strong>Baseline Energy (kWh)</strong> = Σ (Wattage × Duration in min) ÷ 60,000 — summed across all of this month's logs.
                </li>
                <li>
                  • <strong>Baseline CO₂ (kg)</strong> = Σ stored carbon emissions per log, originally computed as kWh × {CARBON_EMISSION_FACTOR} kg CO₂/kWh (Philippine grid factor, DOE).
                </li>
                <li>
                  • <strong>Reduce Electricity by 10%</strong> → Projected Energy = Baseline Energy × 0.90 (simulates a campus-wide efficiency initiative).
                </li>
                <li>
                  • <strong>Switch to Renewable Grid</strong> → Projected CO₂ = Projected Energy × {RENEWABLE_EMISSION_FACTOR} kg CO₂/kWh instead of {CARBON_EMISSION_FACTOR} (DOE PH renewable target).
                </li>
                <li>
                  • <strong>Remove a High-Energy Category</strong> → Logs in the chosen category are excluded before recomputing energy and CO₂.
                </li>
                <li>
                  • <strong>Combined scenarios</strong> are applied in order: category removal → 10% reduction → emission factor. Projected CO₂ always equals Projected Energy × active emission factor.
                </li>
                <li>
                  • <strong>% Reduction</strong> = (Baseline − Projected) ÷ Baseline × 100, shown separately for energy and carbon.
                </li>
              </ul>
            </CardContent>
          </Card>


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
