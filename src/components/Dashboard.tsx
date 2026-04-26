import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useEnergy } from '@/contexts/EnergyContext';
import StatCard from '@/components/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Zap, Leaf, TrendingUp, Trophy, Calendar, Clock, CalendarDays } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { DEVICE_CATEGORIES } from '@/types';

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
  const { user, profile, isAdmin } = useAuth();
  const { getStats } = useEnergy();
  
  // Get user-specific stats for regular users, all stats for admins
  const stats = getStats(isAdmin ? undefined : user?.id);

  const pieData = stats.categoryBreakdown.map((item, index) => ({
    name: item.category,
    value: item.percentage,
    energy: item.energy,
    color: CHART_COLORS[index % CHART_COLORS.length],
  }));

  const getCategoryIcon = (categoryId: string) => {
    return DEVICE_CATEGORIES.find(c => c.name === categoryId)?.icon || 'plug';
  };

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
      <Tabs defaultValue="today" className="space-y-4">
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
              icon={Zap}
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
              title="Monthly Progress"
              value={`${((stats.totalEnergyWeek / stats.totalEnergyMonth) * 100).toFixed(0)}%`}
              subtitle="Of monthly total"
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
      </Tabs>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top 3 Devices */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-warning" />
              Top 3 Energy Consuming Devices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.topDevices.length > 0 ? (
                stats.topDevices.map((device, index) => (
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
                        {DEVICE_CATEGORIES.find(c => c.id === device.category)?.name || device.category}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm">{device.usage.toFixed(2)} kWh</p>
                      <p className="text-xs text-muted-foreground">this month</p>
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
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, value }) => `${value.toFixed(0)}%`}
                      labelLine={false}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number, name: string, props: any) => [
                        `${props.payload.energy.toFixed(2)} kWh (${value.toFixed(1)}%)`,
                        props.payload.name
                      ]}
                    />
                  </PieChart>
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
    </div>
  );
}
