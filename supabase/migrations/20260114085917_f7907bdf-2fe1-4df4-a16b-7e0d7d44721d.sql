-- Create job_applications table to store applications
CREATE TABLE public.job_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  position TEXT NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  location TEXT NOT NULL,
  experience_years INTEGER,
  current_company TEXT,
  linkedin_url TEXT,
  portfolio_url TEXT,
  resume_url TEXT,
  cover_letter TEXT,
  skills TEXT[],
  why_join TEXT,
  availability TEXT,
  salary_expectation TEXT,
  referral_source TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert applications (public job form)
CREATE POLICY "Anyone can submit job applications"
ON public.job_applications
FOR INSERT
WITH CHECK (true);

-- Only authenticated admins can view applications (for now, restrict to service role)
CREATE POLICY "Service role can view all applications"
ON public.job_applications
FOR SELECT
USING (false);

-- Create trigger for updated_at
CREATE TRIGGER update_job_applications_updated_at
BEFORE UPDATE ON public.job_applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for resumes
INSERT INTO storage.buckets (id, name, public) VALUES ('resumes', 'resumes', false);

-- Allow authenticated users to upload resumes
CREATE POLICY "Anyone can upload resumes"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'resumes');

-- Allow service role to read resumes
CREATE POLICY "Service role can read resumes"
ON storage.objects
FOR SELECT
USING (bucket_id = 'resumes' AND auth.role() = 'service_role');