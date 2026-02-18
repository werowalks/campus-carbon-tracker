
-- 1. Revoke anonymous access to sensitive tables (defense-in-depth)
REVOKE SELECT ON public.profiles FROM anon;
REVOKE SELECT ON public.energy_logs FROM anon;
REVOKE SELECT ON public.user_roles FROM anon;

GRANT SELECT ON public.profiles TO authenticated;
GRANT SELECT ON public.energy_logs TO authenticated;
GRANT SELECT ON public.user_roles TO authenticated;

-- 2. Replace permissive site_visits INSERT policy with validated one
DROP POLICY IF EXISTS "Anyone can record visits" ON public.site_visits;

CREATE POLICY "Validated visit tracking only"
ON public.site_visits
FOR INSERT
TO anon, authenticated
WITH CHECK (
  visitor_id IS NOT NULL 
  AND length(visitor_id) > 0 
  AND length(visitor_id) < 100
  AND page_path IS NOT NULL
  AND page_path LIKE '/%'
  AND length(page_path) < 500
  AND (user_agent IS NULL OR length(user_agent) < 1000)
);
