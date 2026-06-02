-- =========================================
-- AI Marketing & Sales Agent — schema
-- =========================================

-- 1. Master settings (single row)
CREATE TABLE public.agent_settings (
  id INT PRIMARY KEY DEFAULT 1,
  kill_switch BOOLEAN NOT NULL DEFAULT false,
  autonomy_level TEXT NOT NULL DEFAULT 'autonomous', -- draft_only | guardrailed | autonomous
  daily_outbound_cap INT NOT NULL DEFAULT 200,
  daily_content_cap INT NOT NULL DEFAULT 3,
  brand_voice TEXT DEFAULT 'Calm, empathetic Hinglish. WellMindAI — anonymous AI mental wellness companion (Aria).',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT only_one_row CHECK (id = 1)
);
GRANT SELECT, INSERT, UPDATE ON public.agent_settings TO authenticated;
GRANT ALL ON public.agent_settings TO service_role;
ALTER TABLE public.agent_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage settings" ON public.agent_settings FOR ALL TO authenticated
  USING (public.is_blog_admin((auth.jwt() ->> 'email')))
  WITH CHECK (public.is_blog_admin((auth.jwt() ->> 'email')));
INSERT INTO public.agent_settings (id) VALUES (1) ON CONFLICT DO NOTHING;

-- 2. Lead scoring + next-best-action
CREATE TABLE public.lead_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL,
  score INT NOT NULL DEFAULT 0, -- 0-100
  temperature TEXT NOT NULL DEFAULT 'cold', -- hot | warm | cold
  next_action TEXT, -- whatsapp | email | discount | call | nurture
  reasoning TEXT,
  scored_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(lead_id)
);
CREATE INDEX idx_lead_scores_lead ON public.lead_scores(lead_id);
CREATE INDEX idx_lead_scores_temp ON public.lead_scores(temperature, score DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lead_scores TO authenticated;
GRANT ALL ON public.lead_scores TO service_role;
ALTER TABLE public.lead_scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read scores" ON public.lead_scores FOR SELECT TO authenticated
  USING (public.is_blog_admin((auth.jwt() ->> 'email')));
CREATE POLICY "Admins write scores" ON public.lead_scores FOR ALL TO authenticated
  USING (public.is_blog_admin((auth.jwt() ->> 'email')))
  WITH CHECK (public.is_blog_admin((auth.jwt() ->> 'email')));

-- 3. Outbound message drafts (WhatsApp / Email)
CREATE TABLE public.marketing_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID,
  channel TEXT NOT NULL, -- whatsapp | email
  recipient TEXT NOT NULL,
  subject TEXT,
  body TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft', -- draft | queued | sent | failed | skipped
  scheduled_for TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  error TEXT,
  created_by TEXT NOT NULL DEFAULT 'agent', -- agent | human
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_marketing_drafts_status ON public.marketing_drafts(status, created_at DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.marketing_drafts TO authenticated;
GRANT ALL ON public.marketing_drafts TO service_role;
ALTER TABLE public.marketing_drafts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read drafts" ON public.marketing_drafts FOR SELECT TO authenticated
  USING (public.is_blog_admin((auth.jwt() ->> 'email')));
CREATE POLICY "Admins write drafts" ON public.marketing_drafts FOR ALL TO authenticated
  USING (public.is_blog_admin((auth.jwt() ->> 'email')))
  WITH CHECK (public.is_blog_admin((auth.jwt() ->> 'email')));

-- 4. Content drafts (blog/social)
CREATE TABLE public.content_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kind TEXT NOT NULL, -- blog | instagram | linkedin | x
  topic TEXT NOT NULL,
  title TEXT,
  body TEXT NOT NULL,
  hashtags TEXT[],
  status TEXT NOT NULL DEFAULT 'draft', -- draft | approved | published | rejected
  blog_post_id UUID, -- link to blog_posts if published
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  published_at TIMESTAMPTZ
);
CREATE INDEX idx_content_drafts_status ON public.content_drafts(status, created_at DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.content_drafts TO authenticated;
GRANT ALL ON public.content_drafts TO service_role;
ALTER TABLE public.content_drafts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read content" ON public.content_drafts FOR SELECT TO authenticated
  USING (public.is_blog_admin((auth.jwt() ->> 'email')));
CREATE POLICY "Admins write content" ON public.content_drafts FOR ALL TO authenticated
  USING (public.is_blog_admin((auth.jwt() ->> 'email')))
  WITH CHECK (public.is_blog_admin((auth.jwt() ->> 'email')));

-- 5. Autonomous run audit log
CREATE TABLE public.agent_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_kind TEXT NOT NULL, -- tick | score | draft_outbound | generate_content | manual
  status TEXT NOT NULL DEFAULT 'completed', -- running | completed | failed
  leads_scored INT DEFAULT 0,
  drafts_created INT DEFAULT 0,
  content_created INT DEFAULT 0,
  drafts_sent INT DEFAULT 0,
  summary TEXT,
  error TEXT,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);
CREATE INDEX idx_agent_runs_started ON public.agent_runs(started_at DESC);
GRANT SELECT, INSERT, UPDATE ON public.agent_runs TO authenticated;
GRANT ALL ON public.agent_runs TO service_role;
ALTER TABLE public.agent_runs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read runs" ON public.agent_runs FOR SELECT TO authenticated
  USING (public.is_blog_admin((auth.jwt() ->> 'email')));
CREATE POLICY "Admins write runs" ON public.agent_runs FOR ALL TO authenticated
  USING (public.is_blog_admin((auth.jwt() ->> 'email')))
  WITH CHECK (public.is_blog_admin((auth.jwt() ->> 'email')));

-- 6. Inbound (visitor) sales chat sessions
CREATE TABLE public.inbound_chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_token TEXT NOT NULL UNIQUE,
  visitor_name TEXT,
  visitor_email TEXT,
  visitor_phone TEXT,
  intent TEXT, -- pricing | trial | counselor | support | other
  qualified BOOLEAN DEFAULT false,
  booked_trial BOOLEAN DEFAULT false,
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_inbound_chat_token ON public.inbound_chat_sessions(session_token);
GRANT SELECT, INSERT, UPDATE ON public.inbound_chat_sessions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.inbound_chat_sessions TO authenticated;
GRANT ALL ON public.inbound_chat_sessions TO service_role;
ALTER TABLE public.inbound_chat_sessions ENABLE ROW LEVEL SECURITY;
-- Visitors can insert/update their own session by token (token-as-key model)
CREATE POLICY "Anyone can create session" ON public.inbound_chat_sessions FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Anyone can update own session by token" ON public.inbound_chat_sessions FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins read all sessions" ON public.inbound_chat_sessions FOR SELECT TO authenticated
  USING (public.is_blog_admin((auth.jwt() ->> 'email')));