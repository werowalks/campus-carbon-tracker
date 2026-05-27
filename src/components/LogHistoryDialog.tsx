import React, { useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useEnergy, EnergyLog } from '@/contexts/EnergyContext';
import { calculateEnergyKWh } from '@/types';
import EditEnergyLogDialog from '@/components/EditEnergyLogDialog';
import { Pencil, Trash2, Search, Plug } from 'lucide-react';
import { toast } from 'sonner';

interface LogHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function LogHistoryDialog({ open, onOpenChange }: LogHistoryDialogProps) {
  const { user } = useAuth();
  const { logs, deleteLog } = useEnergy();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'energy' | 'carbon'>('newest');
  const [editingLog, setEditingLog] = useState<EnergyLog | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const userLogs = useMemo(() => {
    const filtered = logs.filter(l => l.user_id === user?.id);
    const searched = search.trim()
      ? filtered.filter(l =>
          l.device_name.toLowerCase().includes(search.toLowerCase()) ||
          l.category.toLowerCase().includes(search.toLowerCase())
        )
      : filtered;
    const sorted = [...searched];
    sorted.sort((a, b) => {
      if (sortBy === 'newest') return b.timestamp.getTime() - a.timestamp.getTime();
      if (sortBy === 'oldest') return a.timestamp.getTime() - b.timestamp.getTime();
      if (sortBy === 'energy')
        return calculateEnergyKWh(b.wattage, b.duration) - calculateEnergyKWh(a.wattage, a.duration);
      return b.carbon_emission - a.carbon_emission;
    });
    return sorted;
  }, [logs, user?.id, search, sortBy]);

  const handleDelete = async () => {
    if (!confirmDeleteId) return;
    try {
      await deleteLog(confirmDeleteId);
      toast.success('Log deleted');
    } catch {
      toast.error('Failed to delete log');
    } finally {
      setConfirmDeleteId(null);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Energy Log History</DialogTitle>
            <DialogDescription>
              View, edit, or remove any of your past energy logs.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by device or category..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
              <SelectTrigger className="sm:w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover z-50">
                <SelectItem value="newest">Newest first</SelectItem>
                <SelectItem value="oldest">Oldest first</SelectItem>
                <SelectItem value="energy">Highest energy</SelectItem>
                <SelectItem value="carbon">Highest carbon</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="text-xs text-muted-foreground">
            {userLogs.length} {userLogs.length === 1 ? 'log' : 'logs'}
          </div>

          <div className="flex-1 overflow-y-auto -mx-6 px-6">
            {userLogs.length > 0 ? (
              <div className="space-y-2">
                {userLogs.map((log) => (
                  <div key={log.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="p-2 bg-background rounded-lg">
                      <Plug className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-baseline gap-x-2">
                        <p className="text-sm font-medium truncate">{log.device_name}</p>
                        <span className="text-xs text-muted-foreground">{log.category}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {log.timestamp.toLocaleString()} • {log.wattage}W • {(log.duration / 60).toFixed(log.duration % 60 === 0 ? 0 : 2)} h
                      </p>
                      <p className="text-xs">
                        <span className="font-medium">
                          {calculateEnergyKWh(log.wattage, log.duration).toFixed(3)} kWh
                        </span>
                        <span className="text-primary ml-2">
                          {log.carbon_emission.toFixed(4)} kg CO₂
                        </span>
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                        onClick={() => setEditingLog(log)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => setConfirmDeleteId(log.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-12">
                {search ? 'No logs match your search.' : 'No logs yet.'}
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {editingLog && (
        <EditEnergyLogDialog
          log={editingLog}
          open={!!editingLog}
          onOpenChange={(o) => { if (!o) setEditingLog(null); }}
        />
      )}

      <AlertDialog open={!!confirmDeleteId} onOpenChange={(o) => { if (!o) setConfirmDeleteId(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this log?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The log entry will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
