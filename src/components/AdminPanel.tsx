import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useEnergy } from '@/contexts/EnergyContext';
import { calculateEnergyKWh } from '@/types';
import { CAMPUS_DEVICE_CATEGORIES } from '@/data/campusDevices';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Download, Search, Filter, Shield, Trash2, FileSpreadsheet, Calendar, Users, Eye, BarChart3, UserCog, FlaskConical, Mail } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import ScenarioSimulation from './ScenarioSimulation';

interface Member {
  user_id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  created_at: string;
  role: 'admin' | 'user';
}

interface SiteVisitStats {
  totalVisits: number;
  todayVisits: number;
  weekVisits: number;
  monthVisits: number;
  contactPageVisits: number;
  emailClicks: number;
}

export default function AdminPanel() {
  const { isAdmin } = useAuth();
  const { getAllLogs, deleteLog, getStats } = useEnergy();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [members, setMembers] = useState<Member[]>([]);
  const [membersLoading, setMembersLoading] = useState(true);
  const [visitStats, setVisitStats] = useState<SiteVisitStats>({
    totalVisits: 0,
    todayVisits: 0,
    weekVisits: 0,
    monthVisits: 0,
    contactPageVisits: 0,
    emailClicks: 0,
  });
  const [updatingRole, setUpdatingRole] = useState<string | null>(null);
  const [deletingUser, setDeletingUser] = useState<string | null>(null);

  const logs = getAllLogs();
  const stats = getStats();

  // Fetch members and visit stats
  useEffect(() => {
    if (isAdmin) {
      fetchMembers();
      fetchVisitStats();
    }
  }, [isAdmin]);

  // Only admins can access this page
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  const fetchMembers = async () => {
    try {
      setMembersLoading(true);
      
      // Fetch profiles with their roles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, name, email, avatar_url, created_at');
      
      if (profilesError) throw profilesError;

      // Fetch roles
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');
      
      if (rolesError) throw rolesError;

      // Combine data
      const membersData: Member[] = (profiles || []).map(profile => {
        const userRole = roles?.find(r => r.user_id === profile.user_id);
        return {
          ...profile,
          role: (userRole?.role as 'admin' | 'user') || 'user',
        };
      });

      setMembers(membersData);
    } catch (error) {
      console.error('Error fetching members:', error);
      toast.error('Failed to load members');
    } finally {
      setMembersLoading(false);
    }
  };

  const fetchVisitStats = async () => {
    try {
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

      // Fetch all visit counts
      const [totalResult, todayResult, weekResult, monthResult, contactResult, emailClickResult] = await Promise.all([
        supabase.from('site_visits').select('id', { count: 'exact', head: true }),
        supabase.from('site_visits').select('id', { count: 'exact', head: true }).gte('visited_at', todayStart),
        supabase.from('site_visits').select('id', { count: 'exact', head: true }).gte('visited_at', weekStart),
        supabase.from('site_visits').select('id', { count: 'exact', head: true }).gte('visited_at', monthStart),
        supabase.from('site_visits').select('id', { count: 'exact', head: true }).eq('page_path', '/contact'),
        supabase.from('site_visits').select('id', { count: 'exact', head: true }).eq('page_path', '/contact/email-click'),
      ]);

      setVisitStats({
        totalVisits: totalResult.count || 0,
        todayVisits: todayResult.count || 0,
        weekVisits: weekResult.count || 0,
        monthVisits: monthResult.count || 0,
        contactPageVisits: contactResult.count || 0,
        emailClicks: emailClickResult.count || 0,
      });
    } catch (error) {
      console.error('Error fetching visit stats:', error);
    }
  };

  const handleRoleChange = async (userId: string, newRole: 'admin' | 'user') => {
    try {
      setUpdatingRole(userId);
      
      const { error } = await supabase
        .from('user_roles')
        .update({ role: newRole })
        .eq('user_id', userId);

      if (error) throw error;

      // Update local state
      setMembers(prev => prev.map(m => 
        m.user_id === userId ? { ...m, role: newRole } : m
      ));

      toast.success(`Role updated to ${newRole}`);
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('Failed to update role');
    } finally {
      setUpdatingRole(null);
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to delete "${userName}"? This will permanently remove their account and all their energy logs. This action cannot be undone.`)) {
      return;
    }

    try {
      setDeletingUser(userId);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const response = await supabase.functions.invoke('delete-user', {
        body: { user_id: userId },
      });

      if (response.error) throw response.error;

      // Remove from local state
      setMembers(prev => prev.filter(m => m.user_id !== userId));
      toast.success(`User "${userName}" has been deleted`);
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast.error(error?.message || 'Failed to delete user');
    } finally {
      setDeletingUser(null);
    }
  };

  // Filter logs
  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.device_name.toLowerCase().includes(searchTerm.toLowerCase());
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
      log.device_name,
      DEVICE_CATEGORIES.find(c => c.id === log.category)?.name || log.category,
      log.wattage,
      log.duration,
      calculateEnergyKWh(log.wattage, log.duration).toFixed(4),
      log.carbon_emission.toFixed(4),
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
    const headers = ['Date', 'Time', 'Device Name', 'Category', 'Wattage (W)', 'Duration (min)', 'Energy (kWh)', 'Carbon (kg CO2)'];
    
    const summary = [
      ['CAMPUS CARBON FOOTPRINT REPORT'],
      [`Generated: ${format(new Date(), 'MMMM d, yyyy HH:mm')}`],
      [''],
      ['SUMMARY'],
      [`Total Records: ${filteredLogs.length}`],
      [`Total Energy: ${filteredLogs.reduce((sum, log) => sum + calculateEnergyKWh(log.wattage, log.duration), 0).toFixed(2)} kWh`],
      [`Total Carbon: ${filteredLogs.reduce((sum, log) => sum + log.carbon_emission, 0).toFixed(2)} kg CO2`],
      [''],
      ['DETAILED DATA'],
    ];

    const rows = filteredLogs.map(log => [
      format(new Date(log.timestamp), 'yyyy-MM-dd'),
      format(new Date(log.timestamp), 'HH:mm'),
      log.device_name,
      DEVICE_CATEGORIES.find(c => c.id === log.category)?.name || log.category,
      log.wattage,
      log.duration,
      calculateEnergyKWh(log.wattage, log.duration).toFixed(4),
      log.carbon_emission.toFixed(4),
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

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportContactAnalyticsCSV = async () => {
    try {
      const { data, error } = await supabase
        .from('site_visits')
        .select('visited_at, page_path, visitor_id, user_agent')
        .in('page_path', ['/contact', '/contact/email-click'])
        .order('visited_at', { ascending: false });

      if (error) throw error;

      const headers = ['Date', 'Time', 'Event Type', 'Page Path', 'Visitor ID', 'User Agent'];
      const rows = (data || []).map(v => [
        format(new Date(v.visited_at), 'yyyy-MM-dd'),
        format(new Date(v.visited_at), 'HH:mm:ss'),
        v.page_path === '/contact/email-click' ? 'Email Click' : 'Page View',
        v.page_path || '',
        v.visitor_id || '',
        (v.user_agent || '').replace(/"/g, '""'),
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');

      downloadFile(
        csvContent,
        `contact-analytics-${format(new Date(), 'yyyy-MM-dd')}.csv`,
        'text/csv;charset=utf-8;'
      );
      toast.success(`Exported ${rows.length} contact analytics records to CSV`);
    } catch (error) {
      console.error('Error exporting contact analytics:', error);
      toast.error('Failed to export contact analytics');
    }
  };

  const exportContactAnalyticsExcel = async () => {
    try {
      const { data, error } = await supabase
        .from('site_visits')
        .select('visited_at, page_path, visitor_id, user_agent')
        .in('page_path', ['/contact', '/contact/email-click'])
        .order('visited_at', { ascending: false });

      if (error) throw error;

      const records = data || [];
      const pageViews = records.filter(r => r.page_path === '/contact').length;
      const emailClicks = records.filter(r => r.page_path === '/contact/email-click').length;
      const conversionRate = pageViews > 0 ? ((emailClicks / pageViews) * 100).toFixed(2) : '0.00';

      const summary = [
        ['CONTACT PAGE ANALYTICS REPORT'],
        [`Generated: ${format(new Date(), 'MMMM d, yyyy HH:mm')}`],
        [''],
        ['SUMMARY'],
        [`Total Contact Page Views: ${pageViews}`],
        [`Total Email Link Clicks: ${emailClicks}`],
        [`Conversion Rate: ${conversionRate}%`],
        [`Total Records: ${records.length}`],
        [''],
        ['DETAILED EVENTS'],
      ];

      const headers = ['Date', 'Time', 'Event Type', 'Page Path', 'Visitor ID', 'User Agent'];
      const rows = records.map(v => [
        format(new Date(v.visited_at), 'yyyy-MM-dd'),
        format(new Date(v.visited_at), 'HH:mm:ss'),
        v.page_path === '/contact/email-click' ? 'Email Click' : 'Page View',
        v.page_path || '',
        v.visitor_id || '',
        (v.user_agent || '').replace(/"/g, '""'),
      ]);

      const csvContent = [
        ...summary.map(row => row.join(',')),
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');

      downloadFile(
        csvContent,
        `contact-analytics-report-${format(new Date(), 'yyyy-MM-dd')}.xls`,
        'application/vnd.ms-excel;charset=utf-8;'
      );
      toast.success(`Exported ${records.length} contact analytics records to Excel`);
    } catch (error) {
      console.error('Error exporting contact analytics:', error);
      toast.error('Failed to export contact analytics');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteLog(id);
      toast.success('Log entry deleted');
    } catch (error) {
      toast.error('Failed to delete log entry');
    }
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
            Manage users, view analytics, and export data
          </p>
        </div>
      </div>

      {/* Dashboard Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-primary">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Members</p>
                <div className="text-3xl font-bold">{members.length}</div>
              </div>
              <Users className="w-10 h-10 text-primary/20" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-accent">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Site Visits (Today)</p>
                <div className="text-3xl font-bold">{visitStats.todayVisits}</div>
              </div>
              <Eye className="w-10 h-10 text-accent/20" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-info">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Site Visits (Month)</p>
                <div className="text-3xl font-bold">{visitStats.monthVisits}</div>
              </div>
              <BarChart3 className="w-10 h-10 text-info/20" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-warning">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Energy Logs</p>
                <div className="text-3xl font-bold">{logs.length}</div>
              </div>
              <FileSpreadsheet className="w-10 h-10 text-warning/20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contact Page Analytics */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary" />
              <div>
                <CardTitle>Contact Page Analytics</CardTitle>
                <CardDescription>Track engagement on the /contact page</CardDescription>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={exportContactAnalyticsCSV} variant="outline" size="sm" className="gap-2">
                <Download className="w-4 h-4" />
                CSV
              </Button>
              <Button onClick={exportContactAnalyticsExcel} variant="outline" size="sm" className="gap-2">
                <FileSpreadsheet className="w-4 h-4" />
                Excel
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 rounded-lg border-l-4 border-l-info bg-muted/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Contact Page Views</p>
                  <div className="text-3xl font-bold">{visitStats.contactPageVisits}</div>
                  <p className="text-xs text-muted-foreground mt-1">Total visits to /contact</p>
                </div>
                <Eye className="w-10 h-10 text-info/20" />
              </div>
            </div>
            <div className="p-4 rounded-lg border-l-4 border-l-primary bg-muted/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Email Link Clicks</p>
                  <div className="text-3xl font-bold">{visitStats.emailClicks}</div>
                  <p className="text-xs text-muted-foreground mt-1">Clicks on the contact email link</p>
                </div>
                <Mail className="w-10 h-10 text-primary/20" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for different sections */}
      <Tabs defaultValue="members" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-flex">
          <TabsTrigger value="members" className="gap-2">
            <Users className="w-4 h-4" />
            Members
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-2">
            <BarChart3 className="w-4 h-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="logs" className="gap-2">
            <FileSpreadsheet className="w-4 h-4" />
            Energy Logs
          </TabsTrigger>
          <TabsTrigger value="simulation" className="gap-2">
            <FlaskConical className="w-4 h-4" />
            Predictive
          </TabsTrigger>
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
              {membersLoading ? (
                <div className="text-center py-8 text-muted-foreground">Loading members...</div>
              ) : (
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead className="w-32">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {members.map((member) => (
                        <TableRow key={member.user_id}>
                          <TableCell className="font-medium">{member.name}</TableCell>
                          <TableCell className="text-muted-foreground">{member.email}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {format(new Date(member.created_at), 'MMM d, yyyy')}
                          </TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              member.role === 'admin' 
                                ? 'bg-primary/10 text-primary' 
                                : 'bg-muted text-muted-foreground'
                            }`}>
                              {member.role === 'admin' ? '👑 Admin' : '👤 User'}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Select
                                value={member.role}
                                onValueChange={(value: 'admin' | 'user') => handleRoleChange(member.user_id, value)}
                                disabled={updatingRole === member.user_id}
                              >
                                <SelectTrigger className="w-28 h-8 text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="user">User</SelectItem>
                                  <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                              </Select>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                onClick={() => handleDeleteUser(member.user_id, member.name)}
                                disabled={deletingUser === member.user_id}
                                title="Delete user"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-primary" />
                  Site Visit Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span className="text-muted-foreground">Today</span>
                    <span className="text-xl font-bold">{visitStats.todayVisits}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span className="text-muted-foreground">This Week</span>
                    <span className="text-xl font-bold">{visitStats.weekVisits}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span className="text-muted-foreground">This Month</span>
                    <span className="text-xl font-bold">{visitStats.monthVisits}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg">
                    <span className="font-medium">All Time</span>
                    <span className="text-2xl font-bold text-primary">{visitStats.totalVisits}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Population Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span className="text-muted-foreground">Total Users</span>
                    <span className="text-xl font-bold">{members.filter(m => m.role === 'user').length}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span className="text-muted-foreground">Administrators</span>
                    <span className="text-xl font-bold">{members.filter(m => m.role === 'admin').length}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span className="text-muted-foreground">Active Contributors</span>
                    <span className="text-xl font-bold">{new Set(logs.map(l => l.user_id)).size}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg">
                    <span className="font-medium">Total Members</span>
                    <span className="text-2xl font-bold text-primary">{members.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Energy Logs Tab */}
        <TabsContent value="logs">
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
                          <TableCell className="font-medium">{log.device_name}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {DEVICE_CATEGORIES.find(c => c.id === log.category)?.name || log.category}
                          </TableCell>
                          <TableCell className="text-right">{log.wattage}W</TableCell>
                          <TableCell className="text-right">{log.duration}min</TableCell>
                          <TableCell className="text-right">
                            {calculateEnergyKWh(log.wattage, log.duration).toFixed(3)} kWh
                          </TableCell>
                          <TableCell className="text-right font-medium text-primary">
                            {log.carbon_emission.toFixed(4)} kg
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
        </TabsContent>
        {/* Scenario Simulation Tab */}
        <TabsContent value="simulation">
          <ScenarioSimulation />
        </TabsContent>
      </Tabs>
    </div>
  );
}