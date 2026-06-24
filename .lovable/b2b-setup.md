# B2B Unified Architecture — manual SQL

The migration tool isn't available in the current session, so please run this
SQL once in the **Supabase SQL Editor**:

https://supabase.com/dashboard/project/tcqwhsdhbxlzxuoekjom/sql/new

```sql
-- 1. Extend b2b_companies with contract metadata
ALTER TABLE public.b2b_companies
  ADD COLUMN IF NOT EXISTS client_type text
    CHECK (client_type IN ('university','insurance','corporate','startup','trial')) DEFAULT 'corporate',
  ADD COLUMN IF NOT EXISTS subscription_start_date date,
  ADD COLUMN IF NOT EXISTS subscription_end_date date,
  ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true;

-- 2. Access rules — domain or coupon-based authentication per company
CREATE TABLE IF NOT EXISTS public.b2b_access_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.b2b_companies(id) ON DELETE CASCADE,
  auth_type text NOT NULL CHECK (auth_type IN ('domain','coupon')),
  allowed_domain text,
  coupon_prefix text,
  total_seats_allowed int NOT NULL DEFAULT 0,
  seats_used int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.b2b_access_rules TO authenticated;
GRANT ALL ON public.b2b_access_rules TO service_role;
ALTER TABLE public.b2b_access_rules ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "b2b_rules_read_authed" ON public.b2b_access_rules;
CREATE POLICY "b2b_rules_read_authed" ON public.b2b_access_rules
  FOR SELECT TO authenticated USING (true);

-- 3. Single-use coupons (e.g. for insurance policy-holder redemptions)
CREATE TABLE IF NOT EXISTS public.b2b_coupons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.b2b_companies(id) ON DELETE CASCADE,
  code text UNIQUE NOT NULL,
  redeemed_by uuid REFERENCES auth.users(id),
  redeemed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE ON public.b2b_coupons TO authenticated;
GRANT ALL ON public.b2b_coupons TO service_role;
ALTER TABLE public.b2b_coupons ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "b2b_coupons_read_own_or_unused" ON public.b2b_coupons;
CREATE POLICY "b2b_coupons_read_own_or_unused" ON public.b2b_coupons
  FOR SELECT TO authenticated
  USING (redeemed_by IS NULL OR redeemed_by = auth.uid());

-- 4. Link user profiles to a company for the gatekeeper to check
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS company_id uuid REFERENCES public.b2b_companies(id);
```

## Sample data — onboarding a corporate client

```sql
-- Swiggy (corporate, 1-year contract)
INSERT INTO public.b2b_companies (company_name, client_type, is_active, subscription_start_date, subscription_end_date)
VALUES ('Swiggy', 'corporate', true, CURRENT_DATE, CURRENT_DATE + INTERVAL '365 days')
RETURNING id;
-- copy the returned id below
INSERT INTO public.b2b_access_rules (company_id, auth_type, allowed_domain, total_seats_allowed)
VALUES ('<the-id>', 'domain', '@swiggy.in', 5000);
```

## Sample data — university

```sql
INSERT INTO public.b2b_companies (company_name, client_type, is_active, subscription_end_date)
VALUES ('Delhi University', 'university', true, CURRENT_DATE + INTERVAL '365 days')
RETURNING id;
INSERT INTO public.b2b_access_rules (company_id, auth_type, allowed_domain, total_seats_allowed)
VALUES ('<id>', 'domain', '@du.ac.in', 20000);
```

## Sample data — insurance with coupons

```sql
INSERT INTO public.b2b_companies (company_name, client_type, is_active, subscription_end_date)
VALUES ('Digit Insurance', 'insurance', true, CURRENT_DATE + INTERVAL '365 days')
RETURNING id;
INSERT INTO public.b2b_access_rules (company_id, auth_type, coupon_prefix, total_seats_allowed)
VALUES ('<id>', 'coupon', 'DIGIT_WELL_', 1000);

-- Generate 1000 unique single-use coupons
INSERT INTO public.b2b_coupons (company_id, code)
SELECT '<id>', 'DIGIT_WELL_' || upper(substr(md5(random()::text), 1, 8))
FROM generate_series(1, 1000);
```

## Sample data — 7-day domain trial

```sql
INSERT INTO public.b2b_companies (company_name, client_type, is_active, subscription_end_date)
VALUES ('Acme Trial', 'trial', true, CURRENT_DATE + 7)
RETURNING id;
INSERT INTO public.b2b_access_rules (company_id, auth_type, allowed_domain, total_seats_allowed)
VALUES ('<id>', 'domain', '@acmetrial.com', 100);
```

## How it works in the app

1. User signs up with their work/college email.
2. `SubscriptionRoute` calls the **b2b-gatekeeper** edge function.
3. If the email matches an `allowed_domain` on an active company, they bypass the paid subscription check and get premium access.
4. For insurance users, redeem `b2b-redeem-coupon` with their coupon code to link their profile to the company.
5. When a company's `subscription_end_date` passes or `is_active` flips to false, those users are routed to `/expired` and shown the 50% off up-sell.
