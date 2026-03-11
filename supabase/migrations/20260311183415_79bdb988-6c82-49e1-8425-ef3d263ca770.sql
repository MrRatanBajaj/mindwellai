
CREATE TABLE public.content_moderation_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  flagged_message text NOT NULL,
  alert_type text NOT NULL DEFAULT 'profanity',
  severity text NOT NULL DEFAULT 'low',
  detected_words text[] DEFAULT '{}',
  ai_analysis text,
  reviewed boolean NOT NULL DEFAULT false,
  reviewed_by uuid,
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.content_moderation_alerts ENABLE ROW LEVEL SECURITY;

-- Admin can view all alerts
CREATE POLICY "Admin users can view moderation alerts"
ON public.content_moderation_alerts
FOR SELECT
TO public
USING (EXISTS (
  SELECT 1 FROM profiles
  WHERE profiles.user_id = auth.uid()
  AND profiles.email LIKE '%@mindwellai.com%'
));

-- Admin can update (mark reviewed)
CREATE POLICY "Admin users can update moderation alerts"
ON public.content_moderation_alerts
FOR UPDATE
TO public
USING (EXISTS (
  SELECT 1 FROM profiles
  WHERE profiles.user_id = auth.uid()
  AND profiles.email LIKE '%@mindwellai.com%'
));

-- System can insert
CREATE POLICY "System can insert moderation alerts"
ON public.content_moderation_alerts
FOR INSERT
TO public
WITH CHECK (true);
