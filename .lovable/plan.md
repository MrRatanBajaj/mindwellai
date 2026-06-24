## Scope

Five focused changes — counseling split, Tavus fix, legal pages, Aria voice removal, unified B2B backend.

---

### 1. Remove "Dr. Aria" voice persona

- Delete `src/pages/AIVoiceTherapy.tsx`, `src/pages/AITherapist.tsx`, `src/pages/AIAudioCall.tsx`.
- Drop the Aria persona selector + `ElevenLabsPhoneCounselor`-as-Aria flow from `PhoneCounselor.tsx` (will be replaced in step 2).
- Keep `src/lib/ariaPersonas.ts` only if used by the chatbot (`NainaChatbot`); otherwise delete.

### 2. Split Counseling — two pages, two counselors (YARO + AVA)

- **`/consultation/video`** (`src/pages/VideoConsultation.tsx`) — only video. Two cards (YARO male, AVA female) → "Start Video Therapy" → mounts `TavusVideoConsultation` with the counselor's Tavus persona/replica from `src/lib/counselors.ts`.
- **`/consultation/audio`** (`src/pages/AudioConsultation.tsx`) — only audio. Two cards → "Start Audio Call" → mounts `ElevenLabsPhoneCounselor` with YARO/AVA ElevenLabs voice IDs.
- Update `/consultation` (`Consultation.tsx`) to be a hub: two big oil-pastel tiles → Video / Audio.
- Header nav: replace single "Counseling" with dropdown → Video Therapy, Audio Therapy.
- Both pages enforce the existing `SubscriptionRoute` gate so plan quotas (Free 2-min one-time video, Premium minutes, etc.) keep working through `video-session-gate`.

### 3. Fix video counselor (Tavus)

Symptoms reported: "video counselor not working." Likely causes:
- Tavus conversation creation runs synchronously and the edge function times out, or
- Replica/persona IDs aren't set as secrets (`TAVUS_REPLICA_YARO`, `TAVUS_REPLICA_AVA`).

Fix:
- Refactor `supabase/functions/tavus-conversation/index.ts` to return `202 Accepted` immediately with a `conversation_id`, and use `EdgeRuntime.waitUntil` for any post-creation work. Tavus' own `/v2/conversations` POST returns a `conversation_url` quickly, so we mostly need: validate body, call Tavus, return URL, log usage in background.
- Add clear error JSON when `TAVUS_API_KEY` / replica IDs missing (so the client shows a friendly message instead of a blank iframe).
- Client-side `TavusVideoConsultation`: handle non-200 from gate/Tavus with a toast + retry button; show loading skeleton while waiting; ping `video-session-gate` heartbeat every 15s (already in place — verify wiring).

### 4. Privacy Policy & Terms — separate trust pages

- New `src/pages/PrivacyPolicy.tsx` at `/privacy` — HIPAA-aligned data handling, encryption at rest/in transit, RLS, retention, user rights (export/delete), India DPDP Act note, contact `privacy@wellmindai.in`.
- New `src/pages/TermsConditions.tsx` at `/terms` — eligibility, subscription tiers (mirror `lib/pricing.ts`), refund policy, AI counselor disclaimer (not a substitute for licensed care), crisis helplines, governing law (India).
- New `src/pages/TrustCenter.tsx` at `/trust` — single visual page with sections: Security (RLS, encrypted Supabase, JWT auth), Privacy (audit logs, scoped storage), Compliance posture (DPDP-aligned, HIPAA-style controls — explicitly "not a certification"), Subprocessors (Supabase, Razorpay, Stripe, Tavus, ElevenLabs, Lovable AI Gateway), Incident contact.
- Keep existing `/policy` as redirect → `/privacy`. Footer: link Privacy, Terms, Trust separately.

### 5. Unified B2B Architecture

Existing tables: `b2b_companies`, `b2b_invites`, `b2b_members`. Extend rather than replace.

**Migration**

```sql
-- Extend b2b_companies
ALTER TABLE public.b2b_companies
  ADD COLUMN IF NOT EXISTS client_type text
    CHECK (client_type IN ('university','insurance','corporate','startup','trial')) DEFAULT 'corporate',
  ADD COLUMN IF NOT EXISTS subscription_start_date date,
  ADD COLUMN IF NOT EXISTS subscription_end_date date,
  ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;

-- New: access rules
CREATE TABLE public.b2b_access_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.b2b_companies(id) ON DELETE CASCADE,
  auth_type text NOT NULL CHECK (auth_type IN ('domain','coupon')),
  allowed_domain text,
  coupon_prefix text,
  total_seats_allowed int NOT NULL DEFAULT 0,
  seats_used int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
GRANT SELECT ON public.b2b_access_rules TO authenticated;
GRANT ALL ON public.b2b_access_rules TO service_role;
ALTER TABLE public.b2b_access_rules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone authenticated can read rules to check own access"
  ON public.b2b_access_rules FOR SELECT TO authenticated USING (true);

-- Coupons (single-use)
CREATE TABLE public.b2b_coupons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.b2b_companies(id) ON DELETE CASCADE,
  code text UNIQUE NOT NULL,
  redeemed_by uuid REFERENCES auth.users(id),
  redeemed_at timestamptz
);
GRANT SELECT, UPDATE ON public.b2b_coupons TO authenticated;
GRANT ALL ON public.b2b_coupons TO service_role;
ALTER TABLE public.b2b_coupons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read own/unused coupons" ON public.b2b_coupons FOR SELECT TO authenticated
  USING (redeemed_by IS NULL OR redeemed_by = auth.uid());

-- Link profiles → company
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS company_id uuid REFERENCES public.b2b_companies(id);
```

**Edge function `b2b-gatekeeper`** — given the caller's JWT:
1. Load profile → company.
2. If `auth_type=domain`: check email domain matches `allowed_domain`.
3. If `auth_type=coupon`: confirm a `b2b_coupons` row exists with `redeemed_by = user.id`.
4. Return `{ access: 'premium' | 'expired' | 'b2c' , company, expires_at }` based on `is_active && now <= subscription_end_date`.

**Client hook** `useB2BAccess()` — wraps gatekeeper; integrate into `SubscriptionRoute` so active B2B users bypass paid-subscription check.

**Coupon redemption** — edge function `b2b-redeem-coupon` (body: `{ code }`) → matches `coupon_prefix`, marks coupon as redeemed, sets `profiles.company_id`, increments `seats_used`. Surface a "I have a workplace/insurance code" field on `/auth`.

**Up-sell screen** `src/pages/UpsellExpired.tsx` at `/expired` — when gatekeeper returns `b2c`, redirect there with 50%-off CTA → `/plans?promo=B2B50`.

### 6. Cleanup & wiring

- `App.tsx` routes: add `/consultation/video`, `/consultation/audio`, `/privacy`, `/terms`, `/trust`, `/expired`. Remove `/ai-voice-therapy`, `/ai-therapist`, `/ai-audio-call` if present.
- Footer: Privacy, Terms, Trust, Refund.
- Header dropdown: Counseling → Video / Audio.

---

### Out of scope
- New Tavus replica creation (user must add `TAVUS_REPLICA_YARO` / `TAVUS_REPLICA_AVA` secrets if not present).
- Visual redesign of pages outside the five above (existing oil-pastel system reused).
- Admin UI for managing companies/coupons (SQL-only for now).
