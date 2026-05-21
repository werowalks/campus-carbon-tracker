import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useEnergy } from '@/contexts/EnergyContext';
import { useDevices } from '@/contexts/DevicesContext';
import { TIME_INTERVALS, calculateCarbonEmission, calculateEnergyKWh } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DeviceCombobox } from '@/components/DeviceCombobox';
import EditEnergyLogDialog from '@/components/EditEnergyLogDialog';
import { toast } from 'sonner';
import { 
  Zap, 
  Clock, 
  PlusCircle,
  Trash2,
  Plug,
  Pencil
} from 'lucide-react';

interface DeviceEntry {
  id: string;
  deviceName: string;
  category: string;
  wattage: string;
  timeInterval: string;
  customMinutes: string;
}

export default function EnergyLogForm() {
  const { user } = useAuth();
  const { addLog, logs, deleteLog } = useEnergy();
  const { devices: catalogDevices, categoryWattage, emissionFactor, getDevicesByCategory, getDeviceByName } = useDevices();
  const [editingLog, setEditingLog] = useState<typeof logs[0] | null>(null);
  
  const [devices, setDevices] = useState<DeviceEntry[]>([
    { id: '1', deviceName: '', category: '', wattage: '', timeInterval: '', customMinutes: '60' }
  ]);

  const addDevice = () => {
    setDevices([
      ...devices,
      { id: Date.now().toString(), deviceName: '', category: '', wattage: '', timeInterval: '', customMinutes: '1' }
    ]);
  };

  const removeDevice = (id: string) => {
    if (devices.length > 1) {
      setDevices(devices.filter(d => d.id !== id));
    }
  };

  const updateDevice = (id: string, field: keyof DeviceEntry, value: string) => {
    setDevices(devices.map(d => {
      if (d.id === id) {
        const updated = { ...d, [field]: value };

        // Auto-fill category and wattage when device is selected
        if (field === 'deviceName') {
          const selectedDevice = getDeviceByName(value);
          if (selectedDevice) {
            updated.category = selectedDevice.category;
            updated.wattage = selectedDevice.wattage.toString();
          }
        }

        // Auto-fill wattage when category is manually changed; clear device if it no longer matches
        if (field === 'category') {
          const stillValid = catalogDevices.find(
            dev => dev.name === d.deviceName && dev.category === value
          );
          if (!stillValid) {
            updated.deviceName = '';
            updated.wattage = (categoryWattage[value] || 100).toString();
          }
        }

        return updated;
      }
      return d;
    }));
  };

  // Get available devices for a specific category
  const getDevicesForCategory = (category: string) => {
    return getDevicesByCategory(category);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let successCount = 0;

    for (const device of devices) {
      if (!device.deviceName || !device.category || !device.wattage || !device.timeInterval) {
        continue;
      }

      const duration = device.timeInterval === '0'
        ? (parseInt(device.customMinutes) || 0) * 60
        : parseInt(device.timeInterval);

      if (!duration || duration <= 0) {
        continue;
      }

      if (duration > 1440) {
        toast.error(`Device "${device.deviceName}": Duration cannot exceed 24 hours`);
        return;
      }

      try {
        await addLog({
          device_name: device.deviceName,
          category: device.category,
          wattage: parseInt(device.wattage),
          duration,
          timestamp: new Date(),
        });
        successCount++;
      } catch (error) {
        console.error('Error adding log:', error);
      }
    }

    if (successCount > 0) {
      toast.success(`${successCount} device${successCount > 1 ? 's' : ''} logged successfully!`);
      setDevices([{ id: '1', deviceName: '', category: '', wattage: '', timeInterval: '', customMinutes: '1' }]);
    } else {
      toast.error('Please fill in all required fields');
    }
  };

  const calculatePreview = (device: DeviceEntry) => {
    const duration = device.timeInterval === '0'
      ? (parseInt(device.customMinutes) || 0) * 60
      : parseInt(device.timeInterval) || 0;
    const wattage = parseInt(device.wattage) || 0;

    if (!duration || !wattage) return null;

    return {
      energy: calculateEnergyKWh(wattage, duration),
      carbon: calculateCarbonEmission(wattage, duration, emissionFactor),
    };
  };

  // Recent logs for user
  const recentLogs = logs
    .filter(log => log.user_id === user?.id)
    .slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold">Log Energy Consumption</h1>
        <p className="text-muted-foreground mt-1">
          Record your device usage to track your carbon footprint
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Add Devices</CardTitle>
              <CardDescription>
                Log multiple devices at once. Each entry records your energy consumption.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {devices.map((device, index) => {
                  return (
                    <div key={device.id} className="p-4 border rounded-lg space-y-4 relative">
                      {devices.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => removeDevice(device.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}

                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                          {index + 1}
                        </div>
                        <span className="text-sm font-medium">Device {index + 1}</span>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Device *</Label>
                          <DeviceCombobox
                            devices={catalogDevices}
                            value={device.deviceName}
                            onValueChange={(value) => updateDevice(device.id, 'deviceName', value)}
                            placeholder="Search devices..."
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Category</Label>
                          <Input
                            readOnly
                            disabled
                            value={device.category}
                            placeholder="Auto-filled from device"
                            className="bg-muted cursor-not-allowed"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Power Rating (Watts) *</Label>
                          <div className="relative">
                            <Zap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                              type="number"
                              placeholder="e.g., 1500"
                              className="pl-10"
                              value={device.wattage}
                              onChange={(e) => updateDevice(device.id, 'wattage', e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Time Used *</Label>
                          <Select
                            value={device.timeInterval}
                            onValueChange={(value) => updateDevice(device.id, 'timeInterval', value)}
                          >
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

                        {device.timeInterval === '0' && (
                          <div className="space-y-2 sm:col-span-2">
                            <Label>Custom Duration (hours)</Label>
                            <div className="relative">
                              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                              <Input
                                type="number"
                                placeholder="Enter hours (max 24)"
                                className="pl-10"
                                min={1}
                                max={24}
                                value={device.customMinutes}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value);
                                  if (val > 24) {
                                    toast.error('Duration cannot exceed 24 hours');
                                    return;
                                  }
                                  updateDevice(device.id, 'customMinutes', e.target.value);
                                }}
                              />
                            </div>
                            <p className="text-xs text-muted-foreground">Maximum: 24 hours</p>
                          </div>
                        )}
                      </div>

                      {/* Preview */}
                      {calculatePreview(device) && (
                        <div className="p-3 bg-muted rounded-lg flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Estimated Impact:</span>
                          <div className="flex gap-4">
                            <span className="text-sm font-medium">
                              {calculatePreview(device)!.energy.toFixed(3)} kWh
                            </span>
                            <span className="text-sm font-medium text-primary">
                              {calculatePreview(device)!.carbon.toFixed(4)} kg CO₂
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={addDevice}
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Add Another Device
                </Button>

                <Button type="submit" className="w-full eco-gradient">
                  Add All Devices
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Recent Logs Sidebar */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Logs</CardTitle>
            </CardHeader>
            <CardContent>
              {recentLogs.length > 0 ? (
                <div className="space-y-3">
                  {recentLogs.map((log) => (
                    <div key={log.id} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <div className="p-2 bg-background rounded-lg">
                        <Plug className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{log.device_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {log.duration} min • {calculateEnergyKWh(log.wattage, log.duration).toFixed(3)} kWh
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-primary"
                          onClick={() => setEditingLog(log)}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive"
                          onClick={async () => {
                            try {
                              await deleteLog(log.id);
                              toast.success('Log deleted');
                            } catch {
                              toast.error('Failed to delete log');
                            }
                          }}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No logs yet. Start by adding your first device!
                </p>
              )}
            </CardContent>
          </Card>

          {/* Tips Card */}
          <Card className="mt-4 bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <h4 className="font-semibold text-sm mb-2">💡 Quick Tips</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Pick a device — its category and wattage auto-fill</li>
                <li>• Wattage auto-fills based on category average</li>
                <li>• Log regularly for better tracking</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {editingLog && (
        <EditEnergyLogDialog
          log={editingLog}
          open={!!editingLog}
          onOpenChange={(open) => { if (!open) setEditingLog(null); }}
        />
      )}
    </div>
  );
}
