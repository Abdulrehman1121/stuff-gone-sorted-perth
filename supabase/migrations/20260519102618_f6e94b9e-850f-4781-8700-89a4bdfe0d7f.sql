
-- Fix search_path on touch_updated_at
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Tighten booking insert (avoid always-true)
DROP POLICY IF EXISTS "Anyone can submit a booking" ON public.bookings;
CREATE POLICY "Anyone can submit a booking" ON public.bookings
  FOR INSERT TO anon, authenticated
  WITH CHECK (status = 'pending_approval' AND approved_date IS NULL AND approved_time IS NULL AND admin_notes IS NULL);

-- Restrict storage listing on booking-photos: only admins can list/select via API; bucket is public so files are accessible by direct URL
DROP POLICY IF EXISTS "Anyone can view booking photos" ON storage.objects;
CREATE POLICY "Admins can list booking photos" ON storage.objects
  FOR SELECT TO authenticated USING (bucket_id = 'booking-photos' AND public.has_role(auth.uid(), 'admin'));

-- Lock down SECURITY DEFINER execute permissions
REVOKE ALL ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;
