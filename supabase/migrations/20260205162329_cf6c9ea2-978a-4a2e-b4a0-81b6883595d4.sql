-- Create site_visits table for tracking visits
CREATE TABLE public.site_visits (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  visited_at timestamp with time zone NOT NULL DEFAULT now(),
  visitor_id text,
  page_path text,
  user_agent text
);

-- Enable RLS
ALTER TABLE public.site_visits ENABLE ROW LEVEL SECURITY;

-- Only admins can view visits
CREATE POLICY "Admins can view all visits"
ON public.site_visits
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- Allow anonymous inserts for tracking (but data is minimal)
CREATE POLICY "Anyone can record visits"
ON public.site_visits
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Revoke direct SELECT from anon to prevent enumeration
REVOKE SELECT ON public.site_visits FROM anon;