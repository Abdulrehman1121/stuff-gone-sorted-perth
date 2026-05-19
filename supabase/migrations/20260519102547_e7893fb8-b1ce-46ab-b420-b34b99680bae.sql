
-- Enums
CREATE TYPE public.app_role AS ENUM ('admin', 'user');
CREATE TYPE public.booking_status AS ENUM ('pending_approval', 'approved', 'rejected', 'completed', 'cancelled');

-- profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- user_roles
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- has_role function (security definer to avoid RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

-- bookings
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- customer
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  suburb TEXT NOT NULL,
  street_address TEXT,
  contact_method TEXT NOT NULL DEFAULT 'Call',
  -- service
  service_type TEXT NOT NULL,
  item_description TEXT,
  load_size TEXT,
  access_notes TEXT,
  photo_url TEXT,
  -- schedule
  preferred_date DATE NOT NULL,
  preferred_time TEXT NOT NULL,
  alternative_date DATE,
  alternative_time TEXT,
  urgency TEXT,
  -- admin
  status booking_status NOT NULL DEFAULT 'pending_approval',
  approved_date DATE,
  approved_time TEXT,
  admin_notes TEXT
);
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
CREATE TRIGGER bookings_touch_updated BEFORE UPDATE ON public.bookings
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- handle new user -> profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS policies
-- profiles
CREATE POLICY "Users view own profile" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Admins view all profiles" ON public.profiles
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- user_roles
CREATE POLICY "Admins manage roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users view own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- bookings
CREATE POLICY "Anyone can submit a booking" ON public.bookings
  FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins view bookings" ON public.bookings
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update bookings" ON public.bookings
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete bookings" ON public.bookings
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- storage bucket for photos
INSERT INTO storage.buckets (id, name, public) VALUES ('booking-photos', 'booking-photos', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Anyone can upload booking photos" ON storage.objects
  FOR INSERT TO anon, authenticated WITH CHECK (bucket_id = 'booking-photos');
CREATE POLICY "Anyone can view booking photos" ON storage.objects
  FOR SELECT TO anon, authenticated USING (bucket_id = 'booking-photos');
CREATE POLICY "Admins can delete booking photos" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'booking-photos' AND public.has_role(auth.uid(), 'admin'));
