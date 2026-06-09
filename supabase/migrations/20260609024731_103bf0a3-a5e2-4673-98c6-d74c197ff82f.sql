
-- Companies
CREATE TABLE public.b2b_companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID NOT NULL,
  admin_email TEXT NOT NULL,
  company_name TEXT NOT NULL,
  domain TEXT NOT NULL UNIQUE,
  employee_tier TEXT NOT NULL CHECK (employee_tier IN ('1-50','51-500','500+')),
  plan TEXT NOT NULL DEFAULT 'standard',
  seats INTEGER NOT NULL DEFAULT 10,
  monthly_price_inr INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.b2b_companies TO authenticated;
GRANT ALL ON public.b2b_companies TO service_role;
ALTER TABLE public.b2b_companies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage own company" ON public.b2b_companies
  FOR ALL TO authenticated
  USING (auth.uid() = admin_user_id)
  WITH CHECK (auth.uid() = admin_user_id);

CREATE TRIGGER b2b_companies_updated_at
  BEFORE UPDATE ON public.b2b_companies
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Invites
CREATE TABLE public.b2b_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.b2b_companies(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(24),'hex'),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','accepted','revoked')),
  invited_by UUID NOT NULL,
  accepted_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  accepted_at TIMESTAMPTZ
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.b2b_invites TO authenticated;
GRANT ALL ON public.b2b_invites TO service_role;
ALTER TABLE public.b2b_invites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Company admin manages invites" ON public.b2b_invites
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.b2b_companies c WHERE c.id = company_id AND c.admin_user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.b2b_companies c WHERE c.id = company_id AND c.admin_user_id = auth.uid()));

CREATE POLICY "Anyone authed can read invite by token query" ON public.b2b_invites
  FOR SELECT TO authenticated
  USING (true);

-- Members
CREATE TABLE public.b2b_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.b2b_companies(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  email TEXT NOT NULL,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (company_id, user_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.b2b_members TO authenticated;
GRANT ALL ON public.b2b_members TO service_role;
ALTER TABLE public.b2b_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members see their company roster" ON public.b2b_members
  FOR SELECT TO authenticated
  USING (
    user_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.b2b_companies c WHERE c.id = company_id AND c.admin_user_id = auth.uid())
  );

CREATE POLICY "User joins themselves" ON public.b2b_members
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admin removes member" ON public.b2b_members
  FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.b2b_companies c WHERE c.id = company_id AND c.admin_user_id = auth.uid()));
