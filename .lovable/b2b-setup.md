# 🚨 RUN THIS SQL ONCE — Creates B2B tables + seeds TestCorp test company

Open: https://supabase.com/dashboard/project/tcqwhsdhbxlzxuoekjom/sql/new

Paste and run the entire block below. It's idempotent — safe to run multiple times.

```sql
-- 1) Master account
CREATE TABLE IF NOT EXISTS public.b2b_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_name TEXT NOT NULL,
  organization_type TEXT NOT NULL CHECK (organization_type IN ('corporate','college','coaching')),
  admin_email TEXT NOT NULL,
  admin_user_id UUID,
  is_active BOOLEAN NOT NULL DEFAULT false,
  max_seats INT NOT NULL DEFAULT 10,
  seats_consumed INT NOT NULL DEFAULT 0,
  contract_start TIMESTAMPTZ NOT NULL DEFAULT now(),
  contract_end TIMESTAMPTZ NOT NULL,
  razorpay_payment_id TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.b2b_accounts TO authenticated;
GRANT ALL ON public.b2b_accounts TO service_role;
ALTER TABLE public.b2b_accounts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "b2b_acc_admin_read" ON public.b2b_accounts;
CREATE POLICY "b2b_acc_admin_read" ON public.b2b_accounts
  FOR SELECT TO authenticated
  USING (admin_user_id = auth.uid() OR lower(admin_email) = lower(auth.jwt() ->> 'email'));

-- 2) Access gateways (domain OR passcode)
CREATE TABLE IF NOT EXISTS public.b2b_gateways (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES public.b2b_accounts(id) ON DELETE CASCADE,
  auth_strategy TEXT NOT NULL CHECK (auth_strategy IN ('domain_match','secure_passcode')),
  target_domain TEXT UNIQUE,
  secure_passcode TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT ALL ON public.b2b_gateways TO service_role;
ALTER TABLE public.b2b_gateways ENABLE ROW LEVEL SECURITY;

-- 3) Monthly analytics
CREATE TABLE IF NOT EXISTS public.b2b_monthly_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES public.b2b_accounts(id) ON DELETE CASCADE,
  report_month_year TEXT NOT NULL,
  total_active_users INT NOT NULL DEFAULT 0,
  total_ai_sessions_log INT NOT NULL DEFAULT 0,
  stress_reduction_index_pct INT NOT NULL DEFAULT 0,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(account_id, report_month_year)
);
GRANT SELECT ON public.b2b_monthly_analytics TO authenticated;
GRANT ALL ON public.b2b_monthly_analytics TO service_role;
ALTER TABLE public.b2b_monthly_analytics ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "b2b_metrics_admin_read" ON public.b2b_monthly_analytics;
CREATE POLICY "b2b_metrics_admin_read" ON public.b2b_monthly_analytics
  FOR SELECT TO authenticated
  USING (account_id IN (
    SELECT id FROM public.b2b_accounts
    WHERE admin_user_id = auth.uid()
       OR lower(admin_email) = lower(auth.jwt() ->> 'email')
  ));

-- 4) Link profiles to a B2B account
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS b2b_account_id UUID REFERENCES public.b2b_accounts(id) ON DELETE SET NULL;

-- 5) Atomic seat counter (race-safe)
CREATE OR REPLACE FUNCTION public.b2b_increment_seat(_account_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE updated INT;
BEGIN
  UPDATE public.b2b_accounts
  SET seats_consumed = seats_consumed + 1
  WHERE id = _account_id
    AND is_active = true
    AND seats_consumed < max_seats
    AND contract_end > now();
  GET DIAGNOSTICS updated = ROW_COUNT;
  RETURN updated = 1;
END;
$$;
REVOKE ALL ON FUNCTION public.b2b_increment_seat(UUID) FROM public;
GRANT EXECUTE ON FUNCTION public.b2b_increment_seat(UUID) TO service_role;

-- 6) SEED TestCorp Pvt Ltd + 20 employee passcodes + @testcorp.com domain
DO $$
DECLARE acc_id UUID;
BEGIN
  SELECT id INTO acc_id FROM public.b2b_accounts WHERE organization_name = 'TestCorp Pvt Ltd' LIMIT 1;
  IF acc_id IS NULL THEN
    INSERT INTO public.b2b_accounts
      (organization_name, organization_type, admin_email, is_active, max_seats, contract_end)
    VALUES
      ('TestCorp Pvt Ltd', 'corporate', 'admin@testcorp.com', true, 20, now() + interval '90 days')
    RETURNING id INTO acc_id;

    INSERT INTO public.b2b_gateways (account_id, auth_strategy, target_domain)
    VALUES (acc_id, 'domain_match', 'testcorp.com')
    ON CONFLICT (target_domain) DO NOTHING;

    INSERT INTO public.b2b_gateways (account_id, auth_strategy, secure_passcode)
    SELECT acc_id, 'secure_passcode', 'EMP' || lpad(n::text, 3, '0')
    FROM generate_series(1, 20) AS n
    ON CONFLICT (secure_passcode) DO NOTHING;
  END IF;
END $$;
```

After running, open `/business/test-access` in your app to see all 20 codes.

## Test methods
1. **Domain**: sign up with `employee1@testcorp.com` (any password) → auto-premium.
2. **Passcode**: sign up with any email, then call `b2b-verify-member` with body `{"passcode":"EMP001"}` → seat consumed, premium unlocked.
