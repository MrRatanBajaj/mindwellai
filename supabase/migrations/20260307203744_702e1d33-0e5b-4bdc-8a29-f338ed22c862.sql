ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS free_trial_used boolean NOT NULL DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS free_trial_duration_seconds integer DEFAULT 0;