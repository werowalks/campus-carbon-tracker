import React, { useState } from 'react';
import { Check, ChevronsUpDown, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CampusDevice } from '@/data/campusDevices';

interface DeviceComboboxProps {
  devices: CampusDevice[];
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function DeviceCombobox({
  devices,
  value,
  onValueChange,
  disabled = false,
  placeholder = "Search devices...",
}: DeviceComboboxProps) {
  const [open, setOpen] = useState(false);

  const selectedDevice = devices.find((device) => device.name === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-popover font-normal"
          disabled={disabled}
        >
          <span className="truncate">
            {selectedDevice ? selectedDevice.name : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0 bg-popover z-50" align="start">
        <Command className="bg-popover">
          <CommandInput placeholder="Type to search..." className="h-9" />
          <CommandList>
            <CommandEmpty>No device found.</CommandEmpty>
            <CommandGroup className="max-h-[200px] overflow-auto">
              {devices.map((device) => (
                <CommandItem
                  key={device.name}
                  value={device.name}
                  onSelect={(currentValue) => {
                    onValueChange(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="truncate flex-1">{device.name}</span>
                    <span className="text-xs text-muted-foreground ml-2">{device.wattage}W</span>
                  </div>
                  <Check
                    className={cn(
                      "ml-2 h-4 w-4 shrink-0",
                      value === device.name ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
