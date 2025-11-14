-- Create medications table
CREATE TABLE public.medications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  dosage TEXT,
  price DECIMAL(10, 2) NOT NULL,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  requires_prescription BOOLEAN NOT NULL DEFAULT true,
  category TEXT,
  manufacturer TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create prescriptions table
CREATE TABLE public.prescriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  prescription_image_url TEXT NOT NULL,
  doctor_name TEXT,
  doctor_license TEXT,
  verification_status TEXT NOT NULL DEFAULT 'pending',
  ai_verification_result JSONB,
  verified_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create medication orders table
CREATE TABLE public.medication_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  prescription_id UUID REFERENCES public.prescriptions(id),
  medication_id UUID NOT NULL REFERENCES public.medications(id),
  quantity INTEGER NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  delivery_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medication_orders ENABLE ROW LEVEL SECURITY;

-- RLS Policies for medications (public read)
CREATE POLICY "Anyone can view medications"
ON public.medications FOR SELECT
USING (true);

-- RLS Policies for prescriptions (users can only access their own)
CREATE POLICY "Users can view their own prescriptions"
ON public.prescriptions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own prescriptions"
ON public.prescriptions FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own prescriptions"
ON public.prescriptions FOR UPDATE
USING (auth.uid() = user_id);

-- RLS Policies for medication orders
CREATE POLICY "Users can view their own medication orders"
ON public.medication_orders FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own medication orders"
ON public.medication_orders FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own medication orders"
ON public.medication_orders FOR UPDATE
USING (auth.uid() = user_id);

-- Create storage bucket for prescriptions
INSERT INTO storage.buckets (id, name, public) 
VALUES ('prescriptions', 'prescriptions', false);

-- Storage policies for prescriptions
CREATE POLICY "Users can upload their own prescriptions"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'prescriptions' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own prescriptions"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'prescriptions' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Create trigger for updated_at
CREATE TRIGGER update_medications_updated_at
BEFORE UPDATE ON public.medications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_prescriptions_updated_at
BEFORE UPDATE ON public.prescriptions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_medication_orders_updated_at
BEFORE UPDATE ON public.medication_orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();