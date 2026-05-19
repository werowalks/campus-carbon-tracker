import React, { useState } from 'react';
import { EnergyLog } from '@/contexts/EnergyContext';
import { useEnergy } from '@/contexts/EnergyContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DeviceCombobox } from '@/components/DeviceCombobox';
import { useDevices } from '@/contexts/DevicesContext';
import { TIME_INTERVALS, calculateCarbonEmission, calculateEnergyKWh } from '@/types';
import { toast } from 'sonner';
import { Zap, Clock } from 'lucide-react';

interface EditEnergyLogDialogProps {
  log: EnergyLog;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditEnergyLogDialog({ log, open, onOpenChange }: EditEnergyLogDialogProps) {
  const { updateLog } = useEnergy();
  const [category, setCategory] = useState(log.category);
  const [deviceName, setDeviceName] = useState(log.device_name);
  const [wattage, setWattage] = useState(log.wattage.toString());
  const [duration, setDuration] = useState(log.duration.toString());
  const [timeInterval, setTimeInterval] = useState(
    TIME_INTERVALS.find(t => t.value === log.duration) ? log.duration.toString() : '0'
  );
  const [saving, setSaving] = useState(false);

  const availableDevices = category ? getDevicesByCategory(category) : [];

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    setWattage((CATEGORY_WATTAGE[value] || 100).toString());
    setDeviceName('');
  };

  const handleDeviceChange = (value: string) => {
    setDeviceName(value);
    const device = getDevicesByCategory(category).find(d => d.name === value);
    if (device) setWattage(device.wattage.toString());
  };

  const handleTimeIntervalChange = (value: string) => {
    setTimeInterval(value);
    if (value !== '0') setDuration(value);
  };

  const parsedDuration = parseInt(duration) || 0;
  const parsedWattage = parseInt(wattage) || 0;
  const preview = parsedDuration > 0 && parsedWattage > 0 ? {
    energy: calculateEnergyKWh(parsedWattage, parsedDuration),
    carbon: calculateCarbonEmission(parsedWattage, parsedDuration),
  } : null;

  const handleSave = async () => {
    if (!deviceName || !category || !wattage || !duration) {
      toast.error('Please fill in all fields');
      return;
    }
    if (parsedDuration > 1440) {
      toast.error('Duration cannot exceed 24 hours (1440 minutes)');
      return;
    }

    setSaving(true);
    try {
      await updateLog(log.id, {
        device_name: deviceName,
        category,
        wattage: parsedWattage,
        duration: parsedDuration,
      });
      toast.success('Log updated successfully!');
      onOpenChange(false);
    } catch {
      toast.error('Failed to update log');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Energy Log</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={handleCategoryChange}>
              <SelectTrigger className="bg-popover">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-popover z-50">
                {CAMPUS_DEVICE_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Device</Label>
            <DeviceCombobox
              devices={availableDevices}
              value={deviceName}
              onValueChange={handleDeviceChange}
              disabled={!category}
              placeholder={category ? "Search devices..." : "Select category first"}
            />
          </div>

          <div className="space-y-2">
            <Label>Power Rating (Watts)</Label>
            <div className="relative">
              <Zap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="number"
                className="pl-10"
                value={wattage}
                onChange={(e) => setWattage(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Time Used</Label>
            <Select value={timeInterval} onValueChange={handleTimeIntervalChange}>
              <SelectTrigger className="bg-popover">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent className="bg-popover z-50">
                {TIME_INTERVALS.map((interval) => (
                  <SelectItem key={interval.value} value={interval.value.toString()}>
                    {interval.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {timeInterval === '0' && (
            <div className="space-y-2">
              <Label>Custom Duration (minutes)</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="number"
                  className="pl-10"
                  min={1}
                  max={1440}
                  value={duration}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (val > 1440) {
                      toast.error('Duration cannot exceed 24 hours (1440 minutes)');
                      return;
                    }
                    setDuration(e.target.value);
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground">Maximum: 1440 minutes (24 hours)</p>
            </div>
          )}

          {preview && (
            <div className="p-3 bg-muted rounded-lg flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Estimated Impact:</span>
              <div className="flex gap-4">
                <span className="text-sm font-medium">{preview.energy.toFixed(3)} kWh</span>
                <span className="text-sm font-medium text-primary">{preview.carbon.toFixed(4)} kg CO₂</span>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving} className="eco-gradient">
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
