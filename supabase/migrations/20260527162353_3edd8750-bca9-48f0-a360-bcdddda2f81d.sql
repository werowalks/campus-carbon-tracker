
CREATE EXTENSION IF NOT EXISTS pg_cron;

CREATE OR REPLACE FUNCTION public.purge_old_records()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.energy_logs       WHERE timestamp  < now() - interval '5 years';
  DELETE FROM public.site_visits       WHERE visited_at < now() - interval '5 years';
  DELETE FROM public.device_audit_log  WHERE changed_at < now() - interval '5 years';
END;
$$;

REVOKE ALL ON FUNCTION public.purge_old_records() FROM PUBLIC, anon, authenticated;

DO $$
BEGIN
  PERFORM cron.unschedule('purge-old-records-5y');
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

SELECT cron.schedule(
  'purge-old-records-5y',
  '0 3 1 * *',
  $$ SELECT public.purge_old_records(); $$
);
