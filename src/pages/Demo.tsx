import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Leaf, ArrowLeft, ArrowRight, Zap, BarChart3, PlusCircle,
  Users, Shield, Download, FlaskConical, TrendingDown,
  Plug, Clock, Eye, FileSpreadsheet, UserCog
} from 'lucide-react';
import SEO from '@/components/SEO';

// Mock data for demo
const mockUserStats = {
  todayEnergy: 2.45,
  todayCO2: 1.715,
  weekEnergy: 18.32,
  weekCO2: 12.824,
  monthEnergy: 67.85,
  monthCO2: 47.495,
};

const mockDevices = [
  { name: 'Desktop Computer', category: 'Computers & Laptops', wattage: 250, duration: 480, energy: 2.0 },
  { name: 'Air Conditioner (Window)', category: 'HVAC / Air Conditioning', wattage: 1500, duration: 120, energy: 3.0 },
  { name: 'LED Panel Light', category: 'Lighting', wattage: 45, duration: 600, energy: 0.45 },
];

const mockMembers = [
  { name: 'Maria Santos', email: 'maria@university.edu', role: 'admin', joined: 'Jan 15, 2026' },
  { name: 'Juan Dela Cruz', email: 'juan@university.edu', role: 'user', joined: 'Jan 20, 2026' },
  { name: 'Ana Reyes', email: 'ana@university.edu', role: 'user', joined: 'Feb 1, 2026' },
  { name: 'Carlos Garcia', email: 'carlos@university.edu', role: 'user', joined: 'Feb 3, 2026' },
];

const mockCategories = [
  { category: 'HVAC / Air Conditioning', percentage: 42, energy: 28.5 },
  { category: 'Computers & Laptops', percentage: 28, energy: 19.0 },
  { category: 'Lighting', percentage: 15, energy: 10.2 },
  { category: 'Laboratory Equipment', percentage: 10, energy: 6.8 },
  { category: 'Other Devices', percentage: 5, energy: 3.35 },
];

function MockStatCard({ icon: Icon, label, value, unit, color }: {
  icon: React.ElementType; label: string; value: string; unit: string; color: string;
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <div className="text-2xl font-bold">{value} <span className="text-sm font-normal text-muted-foreground">{unit}</span></div>
          </div>
          <div className={`p-3 rounded-xl ${color}`}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Demo() {
  const [activeRole, setActiveRole] = useState<'user' | 'admin'>('user');

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="WattLog Demo — Interactive Dashboard Walkthrough"
        description="Try a guided demo of WattLog: log device usage, view real-time energy and CO₂ analytics, and explore admin tools and predictive scenarios."
        path="/demo"
      />
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
            <div className="h-6 w-px bg-border" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg eco-gradient flex items-center justify-center">
                <Leaf className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-display font-bold">WattLog Demo</span>
            </div>
          </div>
          <Link to="/login">
            <Button className="eco-gradient">
              Get Started <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </header>

      <main className="container py-8 space-y-8">
        {/* Role Selector */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-display font-bold">
            Explore WattLog
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            See how the platform works for different roles. Switch between User and Admin views below.
          </p>
          <div className="inline-flex items-center gap-2 p-1 bg-muted rounded-lg">
            <Button
              variant={activeRole === 'user' ? 'default' : 'ghost'}
              className={activeRole === 'user' ? 'eco-gradient' : ''}
              onClick={() => setActiveRole('user')}
            >
              <Plug className="w-4 h-4 mr-2" />
              User View
            </Button>
            <Button
              variant={activeRole === 'admin' ? 'default' : 'ghost'}
              className={activeRole === 'admin' ? 'eco-gradient' : ''}
              onClick={() => setActiveRole('admin')}
            >
              <Shield className="w-4 h-4 mr-2" />
              Admin View
            </Button>
          </div>
        </div>

        {/* User Demo */}
        {activeRole === 'user' && (
          <div className="space-y-8 animate-fade-in">
            {/* Section: Dashboard */}
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-primary border-primary/30">Dashboard</Badge>
                <span className="text-sm text-muted-foreground">Monitor your energy usage at a glance</span>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <MockStatCard icon={Zap} label="Today's Energy" value={mockUserStats.todayEnergy.toFixed(2)} unit="kWh" color="bg-primary/10 text-primary" />
                <MockStatCard icon={TrendingDown} label="Today's CO₂" value={mockUserStats.todayCO2.toFixed(3)} unit="kg" color="bg-accent/10 text-accent" />
                <MockStatCard icon={BarChart3} label="This Month" value={mockUserStats.monthEnergy.toFixed(2)} unit="kWh" color="bg-info/10 text-info" />
              </div>

              {/* Category Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Category Breakdown (Monthly)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockCategories.map((cat) => (
                    <div key={cat.category} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{cat.category}</span>
                        <span className="text-muted-foreground">{cat.percentage}% • {cat.energy} kWh</span>
                      </div>
                      <Progress value={cat.percentage} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </section>

            {/* Section: Energy Logging */}
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-primary border-primary/30">Energy Logging</Badge>
                <span className="text-sm text-muted-foreground">Record your device usage quickly</span>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Log Energy Consumption</CardTitle>
                  <CardDescription>Select a device, set the duration, and log your usage</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Mock form preview */}
                    <div className="p-4 border rounded-lg space-y-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">1</div>
                        <span className="text-sm font-medium">Device 1</span>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-1">
                          <span className="text-sm font-medium">Category</span>
                          <div className="h-10 rounded-md border bg-muted/50 flex items-center px-3 text-sm">Computers & Laptops</div>
                        </div>
                        <div className="space-y-1">
                          <span className="text-sm font-medium">Device</span>
                          <div className="h-10 rounded-md border bg-muted/50 flex items-center px-3 text-sm">Desktop Computer</div>
                        </div>
                        <div className="space-y-1">
                          <span className="text-sm font-medium">Power Rating</span>
                          <div className="h-10 rounded-md border bg-muted/50 flex items-center px-3 text-sm">
                            <Zap className="w-4 h-4 mr-2 text-muted-foreground" /> 250 W
                          </div>
                        </div>
                        <div className="space-y-1">
                          <span className="text-sm font-medium">Time Used</span>
                          <div className="h-10 rounded-md border bg-muted/50 flex items-center px-3 text-sm">
                            <Clock className="w-4 h-4 mr-2 text-muted-foreground" /> 8 hours
                          </div>
                        </div>
                      </div>
                      <div className="p-3 bg-muted rounded-lg flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Estimated Impact:</span>
                        <div className="flex gap-4">
                          <span className="text-sm font-medium">2.000 kWh</span>
                          <span className="text-sm font-medium text-primary">1.4000 kg CO₂</span>
                        </div>
                      </div>
                    </div>

                    <Button variant="outline" className="w-full" disabled>
                      <PlusCircle className="w-4 h-4 mr-2" /> Add Another Device
                    </Button>
                    <Button className="w-full eco-gradient" disabled>Log All Devices</Button>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Recent Logs */}
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-primary border-primary/30">Recent Activity</Badge>
                <span className="text-sm text-muted-foreground">Your latest logged devices</span>
              </div>
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    {mockDevices.map((device, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                        <div className="p-2 bg-background rounded-lg">
                          <Plug className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{device.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {device.duration} min • {device.energy.toFixed(3)} kWh
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        )}

        {/* Admin Demo */}
        {activeRole === 'admin' && (
          <div className="space-y-8 animate-fade-in">
            {/* Admin Overview Cards */}
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-primary border-primary/30">Admin Dashboard</Badge>
                <span className="text-sm text-muted-foreground">Campus-wide overview and management</span>
              </div>
              <div className="grid gap-4 md:grid-cols-4">
                <MockStatCard icon={Users} label="Total Members" value="24" unit="" color="bg-primary/10 text-primary" />
                <MockStatCard icon={Eye} label="Site Visits (Today)" value="142" unit="" color="bg-accent/10 text-accent" />
                <MockStatCard icon={BarChart3} label="Site Visits (Month)" value="3,218" unit="" color="bg-info/10 text-info" />
                <MockStatCard icon={FileSpreadsheet} label="Total Energy Logs" value="1,847" unit="" color="bg-warning/10 text-warning" />
              </div>
            </section>

            {/* Admin Tabs Preview */}
            <section className="space-y-4">
              <Tabs defaultValue="members" className="space-y-4">
                <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-flex">
                  <TabsTrigger value="members" className="gap-2"><Users className="w-4 h-4" /> Members</TabsTrigger>
                  <TabsTrigger value="analytics" className="gap-2"><BarChart3 className="w-4 h-4" /> Analytics</TabsTrigger>
                  <TabsTrigger value="logs" className="gap-2"><FileSpreadsheet className="w-4 h-4" /> Energy Logs</TabsTrigger>
                  <TabsTrigger value="simulation" className="gap-2"><FlaskConical className="w-4 h-4" /> Predictive</TabsTrigger>
                </TabsList>

                {/* Members Tab */}
                <TabsContent value="members">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <UserCog className="w-5 h-5 text-primary" />
                        <div>
                          <CardTitle>Member Management</CardTitle>
                          <CardDescription>View all members and manage their roles</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-md border overflow-hidden">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b bg-muted/50">
                              <th className="p-3 text-left text-sm font-medium">Name</th>
                              <th className="p-3 text-left text-sm font-medium">Email</th>
                              <th className="p-3 text-left text-sm font-medium">Joined</th>
                              <th className="p-3 text-left text-sm font-medium">Role</th>
                              <th className="p-3 text-left text-sm font-medium">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {mockMembers.map((member, i) => (
                              <tr key={i} className="border-b last:border-0">
                                <td className="p-3 text-sm font-medium">{member.name}</td>
                                <td className="p-3 text-sm text-muted-foreground">{member.email}</td>
                                <td className="p-3 text-sm text-muted-foreground">{member.joined}</td>
                                <td className="p-3">
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    member.role === 'admin' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                                  }`}>
                                    {member.role === 'admin' ? '👑 Admin' : '👤 User'}
                                  </span>
                                </td>
                                <td className="p-3">
                                  <div className="h-8 w-28 rounded-md border bg-muted/50 flex items-center px-2 text-xs text-muted-foreground">
                                    {member.role === 'admin' ? 'Admin' : 'User'} ▾
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Analytics Tab */}
                <TabsContent value="analytics">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Eye className="w-5 h-5 text-primary" />
                        Site Visit Statistics
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { label: 'Today', value: '142' },
                          { label: 'This Week', value: '876' },
                          { label: 'This Month', value: '3,218' },
                          { label: 'All Time', value: '12,450' },
                        ].map((stat) => (
                          <div key={stat.label} className={`flex justify-between items-center p-3 rounded-lg ${stat.label === 'All Time' ? 'bg-primary/10' : 'bg-muted/50'}`}>
                            <span className={stat.label === 'All Time' ? 'font-medium' : 'text-muted-foreground'}>{stat.label}</span>
                            <span className={`font-bold ${stat.label === 'All Time' ? 'text-2xl text-primary' : 'text-xl'}`}>{stat.value}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Energy Logs Tab */}
                <TabsContent value="logs">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>All Energy Logs</CardTitle>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" disabled>
                            <Download className="w-4 h-4 mr-2" /> CSV
                          </Button>
                          <Button variant="outline" size="sm" disabled>
                            <FileSpreadsheet className="w-4 h-4 mr-2" /> Excel
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-md border overflow-hidden">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b bg-muted/50">
                              <th className="p-3 text-left text-sm font-medium">Date</th>
                              <th className="p-3 text-left text-sm font-medium">Device</th>
                              <th className="p-3 text-left text-sm font-medium">Category</th>
                              <th className="p-3 text-left text-sm font-medium">Wattage</th>
                              <th className="p-3 text-left text-sm font-medium">Duration</th>
                              <th className="p-3 text-left text-sm font-medium">Energy</th>
                              <th className="p-3 text-left text-sm font-medium">CO₂</th>
                            </tr>
                          </thead>
                          <tbody>
                            {mockDevices.map((device, i) => (
                              <tr key={i} className="border-b last:border-0">
                                <td className="p-3 text-sm">Feb 7, 2026</td>
                                <td className="p-3 text-sm font-medium">{device.name}</td>
                                <td className="p-3 text-sm text-muted-foreground">{device.category}</td>
                                <td className="p-3 text-sm">{device.wattage}W</td>
                                <td className="p-3 text-sm">{device.duration} min</td>
                                <td className="p-3 text-sm">{device.energy.toFixed(3)} kWh</td>
                                <td className="p-3 text-sm text-primary">{(device.energy * 0.7).toFixed(4)} kg</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Predictive Tab */}
                <TabsContent value="simulation">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FlaskConical className="w-5 h-5 text-primary" />
                        Scenario Simulation
                      </CardTitle>
                      <CardDescription>Project sustainability goals using predictive modeling</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-3">
                        {[
                          { label: '10% Energy Reduction', desc: 'Apply a 10% reduction target across all usage' },
                          { label: 'Switch to Renewable Grid', desc: 'Model transition to 0.4 kg CO₂/kWh' },
                          { label: 'Exclude Category', desc: 'See impact of removing a category entirely' },
                        ].map((scenario) => (
                          <div key={scenario.label} className="p-4 border rounded-lg space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">{scenario.label}</span>
                              <div className="w-10 h-5 rounded-full bg-muted border" />
                            </div>
                            <p className="text-xs text-muted-foreground">{scenario.desc}</p>
                          </div>
                        ))}
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="p-4 border rounded-lg text-center space-y-2">
                          <p className="text-sm text-muted-foreground">Baseline Energy</p>
                          <p className="text-3xl font-bold">67.85 <span className="text-sm font-normal">kWh</span></p>
                        </div>
                        <div className="p-4 border rounded-lg text-center space-y-2 bg-primary/5">
                          <p className="text-sm text-muted-foreground">Projected Energy</p>
                          <p className="text-3xl font-bold text-primary">61.07 <span className="text-sm font-normal">kWh</span></p>
                          <Badge className="bg-accent/10 text-accent border-accent/30">↓ 10% Reduction</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </section>
          </div>
        )}

        {/* CTA */}
        <div className="text-center py-8 space-y-4">
          <h2 className="text-2xl font-display font-bold">Ready to track your campus footprint?</h2>
          <p className="text-muted-foreground">Sign up now and start making a difference.</p>
          <Link to="/login">
            <Button size="lg" className="eco-gradient text-lg px-8">
              Get Started <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
