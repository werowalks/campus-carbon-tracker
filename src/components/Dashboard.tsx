import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useEnergy } from '@/contexts/EnergyContext';
import StatCard from '@/components/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Zap, Leaf, TrendingUp, Trophy, Calendar, Clock, CalendarDays, BatteryCharging } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';


const CHART_COLORS = [
  'hsl(152, 45%, 28%)',
  'hsl(142, 70%, 45%)',
  'hsl(38, 92%, 50%)',
  'hsl(199, 89%, 48%)',
  'hsl(280, 65%, 60%)',
  'hsl(340, 75%, 55%)',
  'hsl(200, 70%, 45%)',
  'hsl(160, 60%, 40%)',
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, profile, isAdmin } = useAuth();
  const { getStats, logs, isLoading } = useEnergy();
  const [period, setPeriod] = useState<'today' | 'week' | 'month' | 'year'>('today');
  const [topSort, setTopSort] = useState<'energy' | 'carbon'>('energy');

  // Get user-specific stats for regular users, all stats for admins
  const stats = getStats(isAdmin ? undefined : user?.id, period);

  // Empty state: regular user with no logs yet
  const userLogs = isAdmin ? logs : logs.filter(l => l.user_id === user?.id);
  const isEmpty = !isLoading && !isAdmin && userLogs.length === 0;
  const [showEmptyDialog, setShowEmptyDialog] = useState(true);

  const periodLabel =
    period === 'today' ? 'today' :
    period === 'week' ? 'this week' :
    period === 'year' ? 'this year' :
    'this month';

  const pieData = [...stats.categoryBreakdown]
    .sort((a, b) => b.energy - a.energy)
    .map((item, index) => ({
      name: item.category,
      value: item.percentage,
      energy: item.energy,
      color: CHART_COLORS[index % CHART_COLORS.length],
    }));


  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-display font-bold">
          Welcome back, {profile?.name?.split(' ')[0] || 'User'}! 👋
        </h1>
        <p className="text-muted-foreground">
          Track your campus energy consumption and carbon footprint
        </p>
      </div>

      {/* Stats Overview */}
      {!isEmpty && (
      <Tabs value={period} onValueChange={(v) => setPeriod(v as typeof period)} className="space-y-4">
        <TabsList>
          <TabsTrigger value="today" className="gap-2">
            <Clock className="w-4 h-4" />
            Today
          </TabsTrigger>
          <TabsTrigger value="week" className="gap-2">
            <Calendar className="w-4 h-4" />
            This Week
          </TabsTrigger>
          <TabsTrigger value="month" className="gap-2">
            <TrendingUp className="w-4 h-4" />
            This Month
          </TabsTrigger>
          <TabsTrigger value="year" className="gap-2">
            <CalendarDays className="w-4 h-4" />
            This Year
          </TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Energy Consumed"
              value={`${stats.totalEnergyToday.toFixed(2)} kWh`}
              subtitle="Today's usage"
              icon={BatteryCharging}
              variant="primary"
            />
            <StatCard
              title="Carbon Emission"
              value={`${stats.totalCarbonToday.toFixed(3)} kg`}
              subtitle="CO₂ equivalent"
              icon={Leaf}
              variant="success"
            />
            <StatCard
              title="Weekly Energy"
              value={`${stats.totalEnergyWeek.toFixed(2)} kWh`}
              subtitle="Last 7 days"
              icon={TrendingUp}
            />
            <StatCard
              title="Monthly Carbon"
              value={`${stats.totalCarbonMonth.toFixed(2)} kg`}
              subtitle="This month"
              icon={Leaf}
              variant="warning"
            />
          </div>
        </TabsContent>

        <TabsContent value="week" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Weekly Energy"
              value={`${stats.totalEnergyWeek.toFixed(2)} kWh`}
              subtitle="Last 7 days"
              icon={Zap}
              variant="primary"
            />
            <StatCard
              title="Weekly Carbon"
              value={`${stats.totalCarbonWeek.toFixed(3)} kg`}
              subtitle="CO₂ equivalent"
              icon={Leaf}
              variant="success"
            />
            <StatCard
              title="Daily Average"
              value={`${(stats.totalEnergyWeek / 7).toFixed(2)} kWh`}
              subtitle="Per day"
              icon={TrendingUp}
            />
            <StatCard
              title="Monthly Energy"
              value={`${stats.totalEnergyMonth.toFixed(2)} kWh`}
              subtitle="This month so far"
              icon={Calendar}
              variant="warning"
            />
          </div>
        </TabsContent>

        <TabsContent value="month" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Monthly Energy"
              value={`${stats.totalEnergyMonth.toFixed(2)} kWh`}
              subtitle="This month"
              icon={Zap}
              variant="primary"
            />
            <StatCard
              title="Monthly Carbon"
              value={`${stats.totalCarbonMonth.toFixed(2)} kg`}
              subtitle="CO₂ equivalent"
              icon={Leaf}
              variant="success"
            />
            <StatCard
              title="Weekly Average"
              value={`${(stats.totalEnergyMonth / 4).toFixed(2)} kWh`}
              subtitle="Per week"
              icon={TrendingUp}
            />
            <StatCard
              title="Trees Needed"
              value={Math.ceil(stats.totalCarbonMonth / 21)}
              subtitle="To offset emissions"
              icon={Leaf}
              variant="warning"
            />
          </div>
        </TabsContent>

        <TabsContent value="year" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Yearly Energy"
              value={`${stats.totalEnergyYear.toFixed(2)} kWh`}
              subtitle={`Year ${new Date().getFullYear()}`}
              icon={Zap}
              variant="primary"
            />
            <StatCard
              title="Yearly Carbon"
              value={`${stats.totalCarbonYear.toFixed(2)} kg`}
              subtitle="CO₂ equivalent"
              icon={Leaf}
              variant="success"
            />
            <StatCard
              title="Monthly Average"
              value={`${(stats.totalEnergyYear / 12).toFixed(2)} kWh`}
              subtitle="Per month"
              icon={TrendingUp}
            />
            <StatCard
              title="Trees Needed"
              value={Math.ceil(stats.totalCarbonYear / 21)}
              subtitle="To offset yearly emissions"
              icon={Leaf}
              variant="warning"
            />
          </div>
        </TabsContent>
      </Tabs>
      )}

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top 10 Devices */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-warning" />
                Top 10 {topSort === 'energy' ? 'Energy' : 'Carbon'} Consuming Devices
              </CardTitle>
              <Select value={topSort} onValueChange={(v) => setTopSort(v as 'energy' | 'carbon')}>
                <SelectTrigger className="w-[160px] h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="energy">Energy (kWh)</SelectItem>
                  <SelectItem value="carbon">Carbon (kg CO₂)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.topDevices.length > 0 ? (
                [...stats.topDevices]
                  .sort((a, b) => topSort === 'energy' ? b.usage - a.usage : b.carbon - a.carbon)
                  .slice(0, 10)
                  .map((device, index) => (
                  <div key={device.name} className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      index === 0 ? 'bg-warning/20 text-warning' :
                      index === 1 ? 'bg-muted text-muted-foreground' :
                      'bg-orange-100 text-orange-600'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{device.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {device.category}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm">
                        {topSort === 'energy'
                          ? `${device.usage.toFixed(2)} kWh`
                          : `${device.carbon.toFixed(2)} kg CO₂`}
                      </p>
                      <p className="text-xs text-muted-foreground">{periodLabel}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No device data yet. Start logging your energy consumption!
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Category Breakdown Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Energy by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pieData.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={pieData} margin={{ top: 20, right: 16, left: 0, bottom: 8 }}>
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 11 }}
                      interval={0}
                      angle={-20}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis
                      tick={{ fontSize: 11 }}
                      domain={[0, (dataMax: number) => {
                        if (!dataMax || dataMax <= 0) return 10;
                        // Round up to a "nice" value above the max (next multiple of 10, capped at 100)
                        const padded = dataMax * 1.25;
                        const nice = Math.min(100, Math.ceil(padded / 10) * 10);
                        return Math.max(nice, 10);
                      }]}
                      allowDecimals={false}
                      tickFormatter={(v: number) => `${v}%`}
                      label={{ value: '% of total', angle: -90, position: 'insideLeft', style: { fontSize: 11 } }}
                    />
                    <Tooltip
                      formatter={(value: number, _name: string, props: any) => [
                        `${value.toFixed(1)}% (${props.payload.energy.toFixed(2)} kWh)`,
                        props.payload.name,
                      ]}
                    />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]} label={{ position: 'top', fontSize: 10, formatter: (v: number) => `${v.toFixed(1)}%` }}>
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center">
                <p className="text-muted-foreground">No data available</p>
              </div>
            )}
            
            {/* Legend */}
            <div className="mt-4 grid grid-cols-2 gap-2">
              {pieData.slice(0, 6).map((item, index) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs text-muted-foreground truncate">
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Tips */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <Leaf className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Sustainability Tip</h3>
              <p className="text-sm text-muted-foreground">
                Turning off devices when not in use can reduce your carbon footprint by up to 30%. 
                Consider using power strips to easily manage multiple devices at once.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* First-time empty state dialog */}
      <AlertDialog open={isEmpty && showEmptyDialog} onOpenChange={setShowEmptyDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>No device has been added</AlertDialogTitle>
            <AlertDialogDescription>
              You haven't logged any energy usage yet. Would you like to add your first device now?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Not now</AlertDialogCancel>
            <AlertDialogAction onClick={() => navigate('/log')}>
              Yes, add device
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
