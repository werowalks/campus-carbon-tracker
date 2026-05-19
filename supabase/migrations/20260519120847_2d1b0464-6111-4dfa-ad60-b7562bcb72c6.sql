
-- Devices catalog
CREATE TABLE public.devices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  wattage INTEGER NOT NULL CHECK (wattage > 0),
  source TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID,
  UNIQUE (name, category)
);

ALTER TABLE public.devices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can view devices"
  ON public.devices FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Super admins can insert devices"
  ON public.devices FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Super admins can update devices"
  ON public.devices FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Super admins can delete devices"
  ON public.devices FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'));

CREATE TRIGGER devices_updated_at
  BEFORE UPDATE ON public.devices
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Emission factors
CREATE TABLE public.emission_factors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  factor_kg_per_kwh NUMERIC(6,4) NOT NULL CHECK (factor_kg_per_kwh > 0),
  effective_date DATE NOT NULL,
  source TEXT NOT NULL,
  notes TEXT,
  is_active BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID
);

ALTER TABLE public.emission_factors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can view emission factors"
  ON public.emission_factors FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Super admins can insert emission factors"
  ON public.emission_factors FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Super admins can update emission factors"
  ON public.emission_factors FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Super admins can delete emission factors"
  ON public.emission_factors FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'));

CREATE TRIGGER emission_factors_updated_at
  BEFORE UPDATE ON public.emission_factors
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Audit log
CREATE TABLE public.device_audit_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('device','emission_factor')),
  entity_id UUID,
  action TEXT NOT NULL CHECK (action IN ('insert','update','delete')),
  old_values JSONB,
  new_values JSONB,
  changed_by UUID NOT NULL,
  changed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.device_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Super admins can view audit log"
  ON public.device_audit_log FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Super admins can insert audit entries"
  ON public.device_audit_log FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'super_admin') AND auth.uid() = changed_by);

-- Seed emission factor
INSERT INTO public.emission_factors (factor_kg_per_kwh, effective_date, source, notes, is_active)
VALUES (0.7000, '2024-01-01', 'DOE Philippines National Grid Emission Factor', 'Initial baseline used by WattLog calculations', true);

-- Seed devices
INSERT INTO public.devices (name, category, wattage, source) VALUES
('Laptop','Computing',65,'DOE PH / Manufacturer Adapters (45–90W)'),
('Mobile Phone','Computing',5,'Manufacturer Charging Specs / USB Standards'),
('Nintendo Switch','Computing',18,'Nintendo Official Specs (AC Adapter 15V/2.6A)'),
('Desktop Computer','Computing',250,'DOE PH / Meralco Appliance Guide'),
('iPad','Computing',15,'DOE PH / USB Charging Standards'),
('Tablet','Computing',15,'DOE PH / USB Charging Standards'),
('Monitor','Computing',40,'DOE PH / Meralco Appliance Guide'),
('Portable Monitor','Computing',30,'DOE PH / Manufacturer Display Specs'),
('Electric Kettle','Cafeteria/Kitchen',1500,'Meralco Appliance Wattage Guide'),
('Refrigerator','Cafeteria/Kitchen',150,'Meralco Appliance Wattage Guide'),
('Microwave Oven','Cafeteria/Kitchen',1000,'Meralco Appliance Wattage Guide'),
('Rice Cooker','Cafeteria/Kitchen',700,'Meralco Appliance Wattage Guide'),
('Induction Cooker','Cafeteria/Kitchen',1800,'DOE PH / Meralco Appliance Wattage Guide'),
('Electric Oven','Cafeteria/Kitchen',2400,'Meralco Appliance Wattage Guide'),
('Coffee Machine','Cafeteria/Kitchen',1200,'DOE PH / Meralco SME Guide'),
('Electric Fan','Facilities/HVAC',75,'DOE PH Energy Efficiency Guide'),
('Portable Fan','Facilities/HVAC',50,'DOE PH Energy Efficiency Guide'),
('Air Purifier','Facilities/HVAC',60,'DOE PH / Manufacturer Specs'),
('Tile Cleaning Machine','Facilities/HVAC',1200,'Meralco Commercial Cleaning Equipment Guide'),
('Air Condition (Window Type)','Facilities/HVAC',1200,'Meralco Appliance Wattage Guide (1.0 HP Window Type)'),
('Air Condition (Split Type)','Facilities/HVAC',900,'Meralco Appliance Wattage Guide (1.0 HP Inverter Split Type)'),
('POS Machine','Printing/Office',30,'Meralco SME Energy Guide'),
('Scanner','Printing/Office',30,'DOE PH Appliance Guide'),
('Printer','Printing/Office',400,'DOE PH / Meralco Appliance Guide'),
('Photocopier','Printing/Office',1200,'Meralco Appliance Wattage Guide'),
('DSLR Camera','AV/Classroom',10,'Manufacturer Power Ratings'),
('LCD Projector','AV/Classroom',300,'Meralco Appliance Wattage Guide'),
('Speaker','AV/Classroom',60,'DOE PH / Meralco Appliance Guide'),
('Sound System','AV/Classroom',300,'DOE PH / Meralco Appliance Guide'),
('Television','AV/Classroom',120,'Meralco Appliance Wattage Guide'),
('Ring Light','AV/Classroom',25,'Manufacturer Specs (10" LED Ring Light)'),
('Apple Watch','Wearables',5,'Manufacturer Charging Specs'),
('Samsung Watch','Wearables',5,'Manufacturer Charging Specs'),
('Garmin Watch','Wearables',5,'Manufacturer Charging Specs'),
('Huawei Watch','Wearables',5,'Manufacturer Charging Specs'),
('Fitbit','Wearables',3,'Manufacturer Charging Specs'),
('Xiaomi Watch','Wearables',5,'Manufacturer Charging Specs'),
('Server Computer','Networking',400,'DOE PH / Meralco SME Guide'),
('Network Switch','Networking',50,'DOE PH / Meralco SME Guide'),
('CCTV Camera','Security/Safety',15,'DOE PH / Security Equipment Specs'),
('Hand-Held Metal Detector','Security/Safety',2,'Manufacturer Specs (9V Battery Operated)'),
('Walkthrough Metal Detector','Security/Safety',35,'Manufacturer Specs (Garrett/CEIA Standards)'),
('X-ray Baggage Inspection System','Security/Safety',1500,'Manufacturer Specs (Smiths/Rapiscan Standards)'),
('Water Dispenser','Water/Waste',500,'Meralco Appliance Wattage Guide'),
('LED Light Bulb','Lighting',10,'DOE PH Energy Efficient Lighting Guide');
