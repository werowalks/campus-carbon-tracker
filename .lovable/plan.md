## Goal

Eliminate the legacy `DEVICE_CATEGORIES` constant in `src/types/index.ts` so `src/data/campusDevices.ts` becomes the single source of truth for categories and wattages. Stored `category` values on `energy_logs` already use the campus category strings (e.g. `"Computing"`, `"Facilities/HVAC"`), so the old id→name lookups are effectively dead — they always fall through to the raw `category` string.

## Files to change

### 1. `src/types/index.ts`
- Remove the `DeviceCategory` interface and the `DEVICE_CATEGORIES` array.
- Keep `CARBON_EMISSION_FACTOR`, `calculateCarbonEmission`, `calculateEnergyKWh`, `DashboardStats`, `TIME_INTERVALS`, `EnergyLog`, `User` — those are still used.

### 2. `src/contexts/EnergyContext.tsx`
- Drop `DEVICE_CATEGORIES` from the `@/types` import.
- In `getStats`, replace:
  ```ts
  category: DEVICE_CATEGORIES.find(c => c.id === category)?.name || category,
  ```
  with simply:
  ```ts
  category,
  ```
  (the stored value is already the display name).

### 3. `src/components/Dashboard.tsx`
- Remove the `DEVICE_CATEGORIES` import.
- Delete the unused `getCategoryIcon` helper (defined, never called).
- Replace the line-271 lookup `DEVICE_CATEGORIES.find(c => c.id === device.category)?.name || device.category` with just `device.category`.

### 4. `src/components/AdminPanel.tsx`
- Remove `DEVICE_CATEGORIES` from the `@/types` import.
- Add `import { CAMPUS_DEVICE_CATEGORIES } from '@/data/campusDevices';`.
- Replace the two CSV-export lookups (lines ~236, ~280) and the table-cell lookup (~781) with `log.category` directly.
- Replace the category filter `<Select>` options (~738) to map over `CAMPUS_DEVICE_CATEGORIES` instead, using the category string as both `value` and label.

### 5. `src/components/ScenarioSimulation.tsx`
- Remove `DEVICE_CATEGORIES` from the `@/types` import.
- Simplify `activeCategories` to:
  ```ts
  const activeCategories = useMemo(() => {
    const cats = Array.from(new Set(monthLogs.map(l => l.category)));
    return cats.map(cat => ({ id: cat, name: cat }));
  }, [monthLogs]);
  ```

## Out of scope
- No DB migration — `energy_logs.category` values stay as-is.
- No UI/visual changes; pie chart, filters, exports render the same labels.
- `CATEGORY_WATTAGE` and `CAMPUS_DEVICES` in `campusDevices.ts` are untouched.

## Verification
- TypeScript build passes (no remaining `DEVICE_CATEGORIES` imports).
- Dashboard pie chart still labels segments (e.g. "Computing", "Lighting").
- Admin panel category filter dropdown lists the 10 campus categories.
- CSV export still shows the category column with the same strings as before.
