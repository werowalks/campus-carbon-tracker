import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useEnergy } from '@/contexts/EnergyContext';
import { DEVICE_CATEGORIES, calculateEnergyKWh } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Download, Search, Filter, Shield, Trash2, FileSpreadsheet, Calendar } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminPanel() {
  const { user } = useAuth();
  const { getAllLogs, deleteLog, getStats } = useEnergy();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  // Only admins can access this page
  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  const logs = getAllLogs();
  const stats = getStats();

  // Filter logs
  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.deviceName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || log.category === categoryFilter;
    
    let matchesDate = true;
    if (dateFilter !== 'all') {
      const logDate = new Date(log.timestamp);
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekStart = new Date(todayStart.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

      if (dateFilter === 'today') {
        matchesDate = logDate >= todayStart;
      } else if (dateFilter === 'week') {
        matchesDate = logDate >= weekStart;
      } else if (dateFilter === 'month') {
        matchesDate = logDate >= monthStart;
      }
    }

    return matchesSearch && matchesCategory && matchesDate;
  });

  const exportToCSV = () => {
    const headers = ['Date', 'Time', 'Device Name', 'Category', 'Wattage (W)', 'Duration (min)', 'Energy (kWh)', 'Carbon (kg CO2)'];
    
    const rows = filteredLogs.map(log => [
      format(new Date(log.timestamp), 'yyyy-MM-dd'),
      format(new Date(log.timestamp), 'HH:mm'),
      log.deviceName,
      DEVICE_CATEGORIES.find(c => c.id === log.category)?.name || log.category,
      log.wattage,
      log.duration,
      calculateEnergyKWh(log.wattage, log.duration).toFixed(4),
      log.carbonEmission.toFixed(4),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `carbon-footprint-data-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`Exported ${filteredLogs.length} records to CSV`);
  };

  const exportToExcel = () => {
    // For Excel, we'll create a more formatted CSV that Excel can read
    const headers = ['Date', 'Time', 'Device Name', 'Category', 'Wattage (W)', 'Duration (min)', 'Energy (kWh)', 'Carbon (kg CO2)'];
    
    // Add summary at the top
    const summary = [
      ['CAMPUS CARBON FOOTPRINT REPORT'],
      [`Generated: ${format(new Date(), 'MMMM d, yyyy HH:mm')}`],
      [''],
      ['SUMMARY'],
      [`Total Records: ${filteredLogs.length}`],
      [`Total Energy: ${filteredLogs.reduce((sum, log) => sum + calculateEnergyKWh(log.wattage, log.duration), 0).toFixed(2)} kWh`],
      [`Total Carbon: ${filteredLogs.reduce((sum, log) => sum + log.carbonEmission, 0).toFixed(2)} kg CO2`],
      [''],
      ['DETAILED DATA'],
    ];

    const rows = filteredLogs.map(log => [
      format(new Date(log.timestamp), 'yyyy-MM-dd'),
      format(new Date(log.timestamp), 'HH:mm'),
      log.deviceName,
      DEVICE_CATEGORIES.find(c => c.id === log.category)?.name || log.category,
      log.wattage,
      log.duration,
      calculateEnergyKWh(log.wattage, log.duration).toFixed(4),
      log.carbonEmission.toFixed(4),
    ]);

    const csvContent = [
      ...summary.map(row => row.join(',')),
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `carbon-footprint-report-${format(new Date(), 'yyyy-MM-dd')}.xls`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`Exported ${filteredLogs.length} records to Excel`);
  };

  const handleDelete = (id: string) => {
    deleteLog(id);
    toast.success('Log entry deleted');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Shield className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-display font-bold">Admin Panel</h1>
          <p className="text-muted-foreground">
            Manage and export campus energy consumption data
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{logs.length}</div>
            <p className="text-sm text-muted-foreground">Total Records</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.totalEnergyMonth.toFixed(1)} kWh</div>
            <p className="text-sm text-muted-foreground">Monthly Energy</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.totalCarbonMonth.toFixed(2)} kg</div>
            <p className="text-sm text-muted-foreground">Monthly Carbon</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{new Set(logs.map(l => l.userId)).size}</div>
            <p className="text-sm text-muted-foreground">Active Users</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Export */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Energy Logs</CardTitle>
              <CardDescription>
                View, filter, and export all energy consumption data
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={exportToCSV}>
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              <Button onClick={exportToExcel} className="eco-gradient">
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Export Excel
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by device name..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48 bg-popover">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-popover z-50">
                <SelectItem value="all">All Categories</SelectItem>
                {DEVICE_CATEGORIES.map(cat => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-full sm:w-40 bg-popover">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Date" />
              </SelectTrigger>
              <SelectContent className="bg-popover z-50">
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Data Table */}
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Device</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Wattage</TableHead>
                  <TableHead className="text-right">Duration</TableHead>
                  <TableHead className="text-right">Energy</TableHead>
                  <TableHead className="text-right">Carbon</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.length > 0 ? (
                  filteredLogs.slice(0, 50).map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="text-sm">
                        {format(new Date(log.timestamp), 'MMM d, yyyy HH:mm')}
                      </TableCell>
                      <TableCell className="font-medium">{log.deviceName}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {DEVICE_CATEGORIES.find(c => c.id === log.category)?.name || log.category}
                      </TableCell>
                      <TableCell className="text-right">{log.wattage}W</TableCell>
                      <TableCell className="text-right">{log.duration}min</TableCell>
                      <TableCell className="text-right">
                        {calculateEnergyKWh(log.wattage, log.duration).toFixed(3)} kWh
                      </TableCell>
                      <TableCell className="text-right font-medium text-primary">
                        {log.carbonEmission.toFixed(4)} kg
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => handleDelete(log.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No records found matching your filters
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {filteredLogs.length > 50 && (
            <p className="text-sm text-muted-foreground mt-4 text-center">
              Showing 50 of {filteredLogs.length} records. Export to see all data.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
