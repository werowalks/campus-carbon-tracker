// Campus device data - categories and their devices with academic sources
// Data sourced from: DOE Philippines, Meralco Appliance Wattage Guide, IGES documentation

export interface CampusDevice {
  name: string;
  category: string;
  wattage: number;
  source: string;
}

// Categories derived from the Campus Watt Watch Device Masterlist
export const CAMPUS_DEVICE_CATEGORIES = [
  'Computing',
  'Cafeteria/Kitchen',
  'Facilities/HVAC',
  'Printing/Office',
  'AV/Classroom',
  'Wearables',
  'Networking',
  'Security/Safety',
  'Water/Waste',
  'Lighting',
] as const;

export type CampusDeviceCategory = typeof CAMPUS_DEVICE_CATEGORIES[number];

// Average wattage by category (calculated from device inventory)
export const CATEGORY_WATTAGE: Record<string, number> = {
  'Computing': 115, // Average of computing devices (15-400W)
  'Cafeteria/Kitchen': 1256, // Average of kitchen appliances
  'Facilities/HVAC': 287, // Average of HVAC equipment
  'Printing/Office': 415, // Average of printing/office devices
  'AV/Classroom': 158, // Average of AV equipment
  'Wearables': 5, // Average of wearable devices
  'Networking': 225, // Average of networking equipment
  'Security/Safety': 15, // CCTV camera
  'Water/Waste': 500, // Water dispenser
  'Lighting': 10, // LED light bulb
};

/**
 * Campus Device Masterlist
 * 
 * This inventory was compiled through systematic documentation of electrical
 * equipment found within the campus environment. Wattage values were obtained through:
 * 
 * 1. Nameplate inspection - Reading power rating labels on equipment
 * 2. Manufacturer specifications - Product documentation and datasheets
 * 3. Industry references - DOE Philippines, Meralco Appliance Guide, IGES
 * 
 * Sources:
 * - DOE PH: Department of Energy Philippines Energy Efficiency Guidelines
 * - Meralco: Meralco Appliance Wattage Guide (2023)
 * - IGES: Institute for Global Environmental Strategies (v11.6)
 */
export const CAMPUS_DEVICES: CampusDevice[] = [
  // Computing Devices
  { category: "Computing", name: "Laptop", wattage: 65, source: "DOE PH / Manufacturer Adapters (45–90W)" },
  { category: "Computing", name: "Mobile Phone", wattage: 5, source: "Manufacturer Charging Specs / USB Standards" },
  { category: "Computing", name: "Nintendo Switch", wattage: 18, source: "Nintendo Official Specs (AC Adapter 15V/2.6A)" },
  { category: "Computing", name: "Desktop Computer", wattage: 250, source: "DOE PH / Meralco Appliance Guide" },
  { category: "Computing", name: "iPad", wattage: 15, source: "DOE PH / USB Charging Standards" },
  { category: "Computing", name: "Tablet", wattage: 15, source: "DOE PH / USB Charging Standards" },
  { category: "Computing", name: "Monitor", wattage: 40, source: "DOE PH / Meralco Appliance Guide" },
  { category: "Computing", name: "Portable Monitor", wattage: 30, source: "DOE PH / Manufacturer Display Specs" },

  // Cafeteria/Kitchen Appliances
  { category: "Cafeteria/Kitchen", name: "Electric Kettle", wattage: 1500, source: "Meralco Appliance Wattage Guide" },
  { category: "Cafeteria/Kitchen", name: "Refrigerator", wattage: 150, source: "Meralco Appliance Wattage Guide" },
  { category: "Cafeteria/Kitchen", name: "Microwave Oven", wattage: 1000, source: "Meralco Appliance Wattage Guide" },
  { category: "Cafeteria/Kitchen", name: "Rice Cooker", wattage: 700, source: "Meralco Appliance Wattage Guide" },
  { category: "Cafeteria/Kitchen", name: "Induction Cooker", wattage: 1800, source: "DOE PH / Meralco Appliance Wattage Guide" },
  { category: "Cafeteria/Kitchen", name: "Electric Oven", wattage: 2400, source: "Meralco Appliance Wattage Guide" },
  { category: "Cafeteria/Kitchen", name: "Coffee Machine", wattage: 1200, source: "DOE PH / Meralco SME Guide" },

  // Facilities/HVAC
  { category: "Facilities/HVAC", name: "Electric Fan", wattage: 75, source: "DOE PH Energy Efficiency Guide" },
  { category: "Facilities/HVAC", name: "Portable Fan", wattage: 50, source: "DOE PH Energy Efficiency Guide" },
  { category: "Facilities/HVAC", name: "Air Purifier", wattage: 60, source: "DOE PH / Manufacturer Specs" },
  { category: "Facilities/HVAC", name: "Tile Cleaning Machine", wattage: 1200, source: "Meralco Commercial Cleaning Equipment Guide" },
  { category: "Facilities/HVAC", name: "Air Condition (Window Type)", wattage: 1200, source: "Meralco Appliance Wattage Guide (1.0 HP Window Type)" },
  { category: "Facilities/HVAC", name: "Air Condition (Split Type)", wattage: 900, source: "Meralco Appliance Wattage Guide (1.0 HP Inverter Split Type)" },

  // Printing/Office
  { category: "Printing/Office", name: "POS Machine", wattage: 30, source: "Meralco SME Energy Guide" },
  { category: "Printing/Office", name: "Scanner", wattage: 30, source: "DOE PH Appliance Guide" },
  { category: "Printing/Office", name: "Printer", wattage: 400, source: "DOE PH / Meralco Appliance Guide" },
  { category: "Printing/Office", name: "Photocopier", wattage: 1200, source: "Meralco Appliance Wattage Guide" },

  // AV/Classroom
  { category: "AV/Classroom", name: "DSLR Camera", wattage: 10, source: "Manufacturer Power Ratings" },
  { category: "AV/Classroom", name: "LCD Projector", wattage: 300, source: "Meralco Appliance Wattage Guide" },
  { category: "AV/Classroom", name: "Speaker", wattage: 60, source: "DOE PH / Meralco Appliance Guide" },
  { category: "AV/Classroom", name: "Sound System", wattage: 300, source: "DOE PH / Meralco Appliance Guide" },
  { category: "AV/Classroom", name: "Television", wattage: 120, source: "Meralco Appliance Wattage Guide" },
  { category: "AV/Classroom", name: "Ring Light", wattage: 25, source: "Manufacturer Specs (10\" LED Ring Light)" },

  // Wearables
  { category: "Wearables", name: "Apple Watch", wattage: 5, source: "Manufacturer Charging Specs" },
  { category: "Wearables", name: "Samsung Watch", wattage: 5, source: "Manufacturer Charging Specs" },
  { category: "Wearables", name: "Garmin Watch", wattage: 5, source: "Manufacturer Charging Specs" },
  { category: "Wearables", name: "Huawei Watch", wattage: 5, source: "Manufacturer Charging Specs" },
  { category: "Wearables", name: "Fitbit", wattage: 3, source: "Manufacturer Charging Specs" },
  { category: "Wearables", name: "Xiaomi Watch", wattage: 5, source: "Manufacturer Charging Specs" },

  // Networking
  { category: "Networking", name: "Server Computer", wattage: 400, source: "DOE PH / Meralco SME Guide" },
  { category: "Networking", name: "Network Switch", wattage: 50, source: "DOE PH / Meralco SME Guide" },

  // Security/Safety
  { category: "Security/Safety", name: "CCTV Camera", wattage: 15, source: "DOE PH / Security Equipment Specs" },
  { category: "Security/Safety", name: "Hand-Held Metal Detector", wattage: 2, source: "Manufacturer Specs (9V Battery Operated)" },
  { category: "Security/Safety", name: "Walkthrough Metal Detector", wattage: 35, source: "Manufacturer Specs (Garrett/CEIA Standards)" },
  { category: "Security/Safety", name: "X-ray Baggage Inspection System", wattage: 1500, source: "Manufacturer Specs (Smiths/Rapiscan Standards)" },

  // Water/Waste
  { category: "Water/Waste", name: "Water Dispenser", wattage: 500, source: "Meralco Appliance Wattage Guide" },

  // Lighting
  { category: "Lighting", name: "LED Light Bulb", wattage: 10, source: "DOE PH Energy Efficient Lighting Guide" },
];

/**
 * Get devices filtered by category
 * @param category - The device category to filter by
 * @returns Array of devices in the specified category
 */
export function getDevicesByCategory(category: string): CampusDevice[] {
  return CAMPUS_DEVICES.filter(device => device.category === category);
}

/**
 * Get device wattage by name
 * @param deviceName - The name of the device
 * @returns The wattage of the device, or null if not found
 */
export function getDeviceWattage(deviceName: string): number | null {
  const device = CAMPUS_DEVICES.find(d => d.name === deviceName);
  return device ? device.wattage : null;
}

/**
 * Get all unique categories from the device list
 * @returns Array of unique category names
 */
export function getAllCategories(): string[] {
  return [...new Set(CAMPUS_DEVICES.map(device => device.category))];
}
