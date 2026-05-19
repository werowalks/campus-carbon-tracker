-- Profiles: super admins can view all
CREATE POLICY "Super admins can view all profiles"
ON public.profiles FOR SELECT
USING (has_role(auth.uid(), 'super_admin'::app_role));

-- Energy logs: super admins can view & delete all
CREATE POLICY "Super admins can view all energy logs"
ON public.energy_logs FOR SELECT
USING (has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Super admins can delete any energy logs"
ON public.energy_logs FOR DELETE
USING (has_role(auth.uid(), 'super_admin'::app_role));

-- Site visits: super admins can view
CREATE POLICY "Super admins can view all visits"
ON public.site_visits FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'super_admin'::app_role));

-- user_roles: rework so admins can't touch super_admin rows; super admins can manage all
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;

CREATE POLICY "Admins can view all roles"
ON public.user_roles FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

-- Admins may insert/update/delete only NON super_admin rows
CREATE POLICY "Admins can insert non-super roles"
ON public.user_roles FOR INSERT
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role) AND role <> 'super_admin'::app_role
);

CREATE POLICY "Admins can update non-super roles"
ON public.user_roles FOR UPDATE
USING (
  has_role(auth.uid(), 'admin'::app_role) AND role <> 'super_admin'::app_role
)
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role) AND role <> 'super_admin'::app_role
);

CREATE POLICY "Admins can delete non-super roles"
ON public.user_roles FOR DELETE
USING (
  has_role(auth.uid(), 'admin'::app_role) AND role <> 'super_admin'::app_role
);

-- Super admins: full manage
CREATE POLICY "Super admins can manage all roles"
ON public.user_roles FOR ALL
USING (has_role(auth.uid(), 'super_admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'super_admin'::app_role));