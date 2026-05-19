import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useDevices, DBDevice, EmissionFactor } from '@/contexts/DevicesContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Cpu, Gauge, History, Pencil, Plus, Trash2, Save, ShieldCheck, Search } from 'lucide-react';
import { format } from 'date-fns';

interface AuditEntry {
  id: string;
  entity_type: string;
  entity_id: string | null;
  action: string;
  old_values: any;
  new_values: any;
  changed_by: string;
  changed_at: string;
}

function logAudit(
  userId: string,
  entity_type: 'device' | 'emission_factor',
  entity_id: string | null,
  action: 'create' | 'update' | 'delete',
  old_values: any,
  new_values: any,
) {
  return supabase.from('device_audit_log').insert({
    entity_type,
    entity_id,
    action,
    old_values,
    new_values,
    changed_by: userId,
  });
}

export default function DeviceCatalogPanel() {
  const { user } = useAuth();
  const { devices, categories, activeFactorRow, refresh } = useDevices();

  const [search, setSearch] = useState('');
  const [editingDevice, setEditingDevice] = useState<DBDevice | null>(null);
  const [newDevice, setNewDevice] = useState(false);
  const [factorOpen, setFactorOpen] = useState(false);

  const [factors, setFactors] = useState<EmissionFactor[]>([]);
  const [audit, setAudit] = useState<AuditEntry[]>([]);

  const fetchAux = async () => {
    const [f, a] = await Promise.all([
      supabase.from('emission_factors').select('*').order('effective_date', { ascending: false }),
      supabase.from('device_audit_log').select('*').order('changed_at', { ascending: false }).limit(50),
    ]);
    setFactors((f.data as EmissionFactor[]) || []);
    setAudit((a.data as AuditEntry[]) || []);
  };

  useEffect(() => { fetchAux(); }, []);

  const filtered = devices.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.category.toLowerCase().includes(search.toLowerCase()),
  );

  const handleDeleteDevice = async (d: DBDevice) => {
    if (!user) return;
    if (!confirm(`Delete device "${d.name}"? This cannot be undone.`)) return;
    const { error } = await supabase.from('devices').delete().eq('id', d.id);
    if (error) { toast.error(error.message); return; }
    await logAudit(user.id, 'device', d.id, 'delete', d, null);
    toast.success('Device deleted');
    await refresh();
    fetchAux();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" />
              <div>
                <CardTitle>Super Admin: Device Catalog</CardTitle>
                <CardDescription>
                  Manage device wattages and the active Philippine grid emission factor. All edits are audited.
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Active Emission Factor */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Gauge className="w-5 h-5 text-primary" />
              <div>
                <CardTitle className="text-lg">Active Emission Factor</CardTitle>
                <CardDescription>
                  Used to compute CO₂ for every new log. Changing it does not recompute historical logs.
                </CardDescription>
              </div>
            </div>
            <Button onClick={() => setFactorOpen(true)} variant="outline" size="sm" className="gap-2">
              <Plus className="w-4 h-4" /> Publish New Factor
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {activeFactorRow ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Current Factor</p>
                <p className="text-3xl font-bold text-primary">
                  {Number(activeFactorRow.factor_kg_per_kwh).toFixed(3)}
                  <span className="text-sm text-muted-foreground ml-2">kg CO₂/kWh</span>
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Effective {format(new Date(activeFactorRow.effective_date), 'MMM d, yyyy')}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Source / Citation</p>
                <p className="text-sm font-medium mt-1">{activeFactorRow.source}</p>
                {activeFactorRow.notes && (
                  <p className="text-xs text-muted-foreground mt-2">{activeFactorRow.notes}</p>
                )}
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No active emission factor.</p>
          )}

          {factors.length > 1 && (
            <div className="mt-6">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Historical Factors
              </p>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Factor</TableHead>
                      <TableHead>Effective</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {factors.map(f => (
                      <TableRow key={f.id}>
                        <TableCell className="font-medium">{Number(f.factor_kg_per_kwh).toFixed(3)}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {format(new Date(f.effective_date), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell className="text-sm">{f.source}</TableCell>
                        <TableCell>
                          {f.is_active ? <Badge>Active</Badge> : <Badge variant="secondary">Archived</Badge>}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Devices Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-primary" />
              <div>
                <CardTitle className="text-lg">Devices ({devices.length})</CardTitle>
                <CardDescription>Add, edit or remove devices from the campus catalog.</CardDescription>
              </div>
            </div>
            <Button onClick={() => setNewDevice(true)} className="gap-2 eco-gradient">
              <Plus className="w-4 h-4" /> Add Device
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or category…"
              className="pl-10"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Wattage (W)</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead className="w-24 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(d => (
                  <TableRow key={d.id}>
                    <TableCell className="font-medium">{d.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{d.category}</TableCell>
                    <TableCell className="text-right font-mono">{d.wattage}</TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-xs truncate">{d.source}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditingDevice(d)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleDeleteDevice(d)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No devices match your search.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Audit Log */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-primary" />
            <div>
              <CardTitle className="text-lg">Recent Changes</CardTitle>
              <CardDescription>Last 50 catalog and emission factor edits.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {audit.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No changes recorded yet.</p>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>When</TableHead>
                    <TableHead>Entity</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Change</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {audit.map(a => (
                    <TableRow key={a.id}>
                      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                        {format(new Date(a.changed_at), 'MMM d, HH:mm')}
                      </TableCell>
                      <TableCell className="text-xs">{a.entity_type}</TableCell>
                      <TableCell>
                        <Badge variant={a.action === 'delete' ? 'destructive' : 'secondary'} className="text-xs">{a.action}</Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground max-w-md">
                        <code className="text-[10px] break-all">
                          {summarizeChange(a)}
                        </code>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit / New Device Dialog */}
      <DeviceDialog
        open={newDevice || !!editingDevice}
        device={editingDevice}
        categories={categories}
        onOpenChange={(o) => { if (!o) { setEditingDevice(null); setNewDevice(false); } }}
        onSaved={() => { refresh(); fetchAux(); }}
      />

      {/* New Factor Dialog */}
      <EmissionFactorDialog
        open={factorOpen}
        onOpenChange={setFactorOpen}
        onSaved={() => { refresh(); fetchAux(); }}
        currentFactor={activeFactorRow}
      />
    </div>
  );
}

function summarizeChange(a: AuditEntry): string {
  if (a.action === 'delete') return `Removed: ${JSON.stringify(a.old_values?.name || a.old_values?.factor_kg_per_kwh || a.old_values).slice(0, 80)}`;
  if (a.action === 'create') return `Created: ${JSON.stringify(a.new_values?.name || a.new_values?.factor_kg_per_kwh || a.new_values).slice(0, 80)}`;
  // update
  const o = a.old_values || {};
  const n = a.new_values || {};
  const diffs = Object.keys(n).filter(k => JSON.stringify(o[k]) !== JSON.stringify(n[k]));
  return diffs.map(k => `${k}: ${o[k]} → ${n[k]}`).join(', ');
}

function DeviceDialog({
  open, device, categories, onOpenChange, onSaved,
}: {
  open: boolean;
  device: DBDevice | null;
  categories: string[];
  onOpenChange: (o: boolean) => void;
  onSaved: () => void;
}) {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [wattage, setWattage] = useState('');
  const [source, setSource] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (device) {
      setName(device.name);
      setCategory(device.category);
      setWattage(String(device.wattage));
      setSource(device.source || '');
    } else {
      setName(''); setCategory(''); setWattage(''); setSource('');
    }
    setNewCategory('');
  }, [device, open]);

  const handleSave = async () => {
    if (!user) return;
    const finalCategory = (category === '__new' ? newCategory.trim() : category).trim();
    const w = parseInt(wattage);
    if (!name.trim() || !finalCategory || !w || w <= 0) {
      toast.error('Name, category and a positive wattage are required');
      return;
    }
    setSaving(true);
    try {
      if (device) {
        const payload = { name: name.trim(), category: finalCategory, wattage: w, source: source.trim() || null, updated_by: user.id };
        const { error } = await supabase.from('devices').update(payload).eq('id', device.id);
        if (error) throw error;
        await logAudit(user.id, 'device', device.id, 'update', device, payload);
        toast.success('Device updated');
      } else {
        const payload = { name: name.trim(), category: finalCategory, wattage: w, source: source.trim() || null, updated_by: user.id };
        const { data, error } = await supabase.from('devices').insert(payload).select().single();
        if (error) throw error;
        await logAudit(user.id, 'device', data.id, 'create', null, payload);
        toast.success('Device added');
      }
      onSaved();
      onOpenChange(false);
    } catch (e: any) {
      toast.error(e?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{device ? 'Edit Device' : 'Add Device'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Name *</Label>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Laptop" />
          </div>
          <div className="space-y-2">
            <Label>Category *</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="bg-popover"><SelectValue placeholder="Select category" /></SelectTrigger>
              <SelectContent className="bg-popover z-50">
                {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                <SelectItem value="__new">+ New category…</SelectItem>
              </SelectContent>
            </Select>
            {category === '__new' && (
              <Input className="mt-2" placeholder="New category name" value={newCategory} onChange={e => setNewCategory(e.target.value)} />
            )}
          </div>
          <div className="space-y-2">
            <Label>Wattage (W) *</Label>
            <Input type="number" value={wattage} onChange={e => setWattage(e.target.value)} min={1} />
          </div>
          <div className="space-y-2">
            <Label>Source / Citation</Label>
            <Textarea rows={2} value={source} onChange={e => setSource(e.target.value)} placeholder="e.g. DOE PH / Meralco Appliance Guide" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving} className="gap-2 eco-gradient">
            <Save className="w-4 h-4" /> {saving ? 'Saving…' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EmissionFactorDialog({
  open, onOpenChange, onSaved, currentFactor,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onSaved: () => void;
  currentFactor: EmissionFactor | null;
}) {
  const { user } = useAuth();
  const [factor, setFactor] = useState('');
  const [source, setSource] = useState('');
  const [effective, setEffective] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setFactor('');
      setSource('');
      setEffective(new Date().toISOString().slice(0, 10));
      setNotes('');
    }
  }, [open]);

  const handleSave = async () => {
    if (!user) return;
    const f = parseFloat(factor);
    if (!f || f <= 0 || !source.trim()) {
      toast.error('A positive factor and a source citation are required');
      return;
    }
    setSaving(true);
    try {
      // Deactivate current
      if (currentFactor) {
        const { error: err1 } = await supabase
          .from('emission_factors')
          .update({ is_active: false, updated_by: user.id })
          .eq('id', currentFactor.id);
        if (err1) throw err1;
      }
      const payload = {
        factor_kg_per_kwh: f,
        source: source.trim(),
        effective_date: effective,
        notes: notes.trim() || null,
        is_active: true,
        updated_by: user.id,
      };
      const { data, error } = await supabase.from('emission_factors').insert(payload).select().single();
      if (error) throw error;
      await logAudit(user.id, 'emission_factor', data.id, 'create', currentFactor, payload);
      toast.success('New emission factor published');
      onSaved();
      onOpenChange(false);
    } catch (e: any) {
      toast.error(e?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Publish New Emission Factor</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <p className="text-xs text-muted-foreground">
            The current factor will be archived. Historical energy logs are not recomputed.
          </p>
          <div className="space-y-2">
            <Label>Factor (kg CO₂/kWh) *</Label>
            <Input type="number" step="0.001" value={factor} onChange={e => setFactor(e.target.value)} placeholder="e.g. 0.685" />
          </div>
          <div className="space-y-2">
            <Label>Effective Date *</Label>
            <Input type="date" value={effective} onChange={e => setEffective(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Source / Citation *</Label>
            <Input value={source} onChange={e => setSource(e.target.value)} placeholder="e.g. DOE Philippines 2026 Grid Emission Factor" />
          </div>
          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea rows={2} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Optional context" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving} className="gap-2 eco-gradient">
            <Save className="w-4 h-4" /> {saving ? 'Publishing…' : 'Publish'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
