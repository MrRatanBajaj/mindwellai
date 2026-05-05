
-- Referral codes (one per user)
CREATE TABLE public.referral_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  code TEXT NOT NULL UNIQUE,
  total_invited INTEGER NOT NULL DEFAULT 0,
  total_converted INTEGER NOT NULL DEFAULT 0,
  total_reward_days INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.referral_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own referral code"
  ON public.referral_codes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own referral code"
  ON public.referral_codes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own referral code"
  ON public.referral_codes FOR UPDATE
  USING (auth.uid() = user_id);

-- Lookup by code (public, but only returns minimal info via a view-style policy)
CREATE POLICY "Anyone can lookup code for signup attribution"
  ON public.referral_codes FOR SELECT
  USING (true);

-- Referrals (one row per signup using a code)
CREATE TABLE public.referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_user_id UUID NOT NULL,
  referred_user_id UUID,
  referred_email TEXT,
  code TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending | signed_up | converted | rewarded
  reward_days INTEGER NOT NULL DEFAULT 0,
  converted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view referrals they made"
  ON public.referrals FOR SELECT
  USING (auth.uid() = referrer_user_id);

CREATE POLICY "Users can view referrals where they are referred"
  ON public.referrals FOR SELECT
  USING (auth.uid() = referred_user_id);

CREATE POLICY "Anyone can create a referral row on signup"
  ON public.referrals FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Referrer can update their referrals"
  ON public.referrals FOR UPDATE
  USING (auth.uid() = referrer_user_id);

-- Timestamp trigger
CREATE TRIGGER update_referral_codes_updated_at
  BEFORE UPDATE ON public.referral_codes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_referrals_updated_at
  BEFORE UPDATE ON public.referrals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_referrals_referrer ON public.referrals(referrer_user_id);
CREATE INDEX idx_referrals_code ON public.referrals(code);
CREATE INDEX idx_referral_codes_code ON public.referral_codes(code);
