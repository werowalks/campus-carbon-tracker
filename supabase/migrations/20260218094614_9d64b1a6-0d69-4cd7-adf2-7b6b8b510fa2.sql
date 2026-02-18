CREATE POLICY "Users can update their own energy logs"
ON public.energy_logs
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);