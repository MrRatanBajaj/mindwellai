# Plan — Counselor Images + Soul Machines + Full B2B Self-Serve

## 1. Restore your 3 uploaded images for YARO & AVA
Earlier I changed copy but didn't actually wire your uploaded PNGs into the cards. I will:
- Copy the 3 uploads from `user-uploads://` into `src/assets/counselors/` (`yaro.png`, `ava.png`, plus the 3rd as `yaro-ava-hero.png` for the landing oil-pastel hero panel).
- Reference them by ES6 import in `Index.tsx`, `VideoConsultation.tsx`, `AudioConsultation.tsx`, and `src/lib/counselors.ts`.
- Only the names/labels were ever supposed to change — keep your artwork exactly as uploaded inside the hand-drawn pastel frames.

(Please re-attach the 3 images on the next message — they're not in the project tree right now. I'll wire them the moment they land.)

## 2. Replace Tavus video with Soul Machines virtual humans
Tavus has been flaky. Switch the video counselor to **Soul Machines Workforce** (`workforce.soulmachines.com`) digital people for YARO and AVA.

- New page component `SoulMachinesSession.tsx` that mounts the official `@soulmachines/smwebsdk` `Scene` + `Persona` and renders the WebRTC `<video>` from `scene.videoElement`.
- New edge function `soulmachines-jwt` — mints the short-lived JWT from `SOULMACHINES_API_KEY` + `SOULMACHINES_API_SECRET` using the documented HS256 payload (`sm-control`, `sm-control-via-browser`, expiry 60s). Returns `{ url, jwt }`.
- Secrets to add (I'll request via `add_secret` after you approve):
  - `SOULMACHINES_API_KEY`
  - `SOULMACHINES_API_SECRET`
  - `SOULMACHINES_YARO_PERSONA` (Persona ID from your dashboard)
  - `SOULMACHINES_AVA_PERSONA`
- `VideoConsultation.tsx` → swap `TavusVideoConsultation` for `SoulMachinesSession` with counselor prop.
- Keep `video-session-gate` 15s heartbeat untouched (still enforces Free 2-min / paid minute caps).
- Tavus code stays in repo unused (no deletion) so you can revert if needed.

## 3. Full B2B self-serve (DB + checkout + gatekeeper + admin dashboard)

### 3a. Schema migration — your exact spec
```sql
CREATE TABLE public.b2b_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_name TEXT NOT NULL,
  organization_type TEXT NOT NULL CHECK (organization_type IN ('corporate','college','coaching')),
  admin_email TEXT NOT NULL,
  admin_user_id UUID REFERENCES auth.users(id),
  is_active BOOLEAN NOT NULL DEFAULT false,
  max_seats INT NOT NULL DEFAULT 10,
  seats_consumed INT NOT NULL DEFAULT 0,
  contract_start TIMESTAMPTZ NOT NULL DEFAULT now(),
  contract_end TIMESTAMPTZ NOT NULL,
  razorpay_payment_id TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE public.b2b_gateways (...);          -- domain_match | secure_passcode
CREATE TABLE public.b2b_monthly_analytics (...); -- anonymous aggregates
ALTER TABLE public.profiles ADD COLUMN b2b_account_id UUID REFERENCES public.b2b_accounts(id);
```
All three tables get explicit `GRANT`s, RLS enabled, policies:
- `b2b_accounts`: admin reads own row (`admin_user_id = auth.uid()`), service_role writes.
- `b2b_gateways`: service_role only (secrets — never expose passcodes to clients).
- `b2b_monthly_analytics`: admin of the matching `account_id` reads.

Plus a SECURITY DEFINER RPC `b2b_increment_seat(account_id)` for atomic seat counting (your inline UPDATE has a race condition).

### 3b. Pages & routes
- `/business/buy` — `B2BBillingEngine.tsx` (org form, seat slider, live price: corporate ₹149, college ₹49, coaching ₹79 per seat/yr, Razorpay checkout).
- `/business/dashboard` — `B2BAdminDashboard.tsx` (live seat utilization bar + monthly engagement reports, PDF/CSV download via `jspdf`).
- Existing `/business` stays as the marketing landing; add CTA → `/business/buy`.

### 3c. Edge functions
- `b2b-activate` — called by Razorpay handler. Verifies the payment signature against `RAZORPAY_KEY_SECRET`, then creates `b2b_accounts` + `b2b_gateways` rows. (Doing this server-side instead of from the browser is critical — the client snippet you shared lets anyone forge accounts.)
- `b2b-verify-member` — replaces inline `verifyAndRegisterMember`. Takes `{ email, passcode? }`, looks up gateway, checks seat cap, calls `b2b_increment_seat`, sets `profiles.b2b_account_id`. Wired into `Auth.tsx` post-signup and into the existing `SubscriptionRoute` bypass (replacing the old `b2b-gatekeeper`).
- `b2b-monthly-report` — cron-friendly endpoint that rolls up anonymous counts from `ai_counseling_sessions` + `therapy_sessions` into `b2b_monthly_analytics` for the previous month.

### 3d. Header/footer
- Keep "For Business" in footer pointing at `/business`.
- After login, if `profiles.b2b_account_id` is set AND the user's email matches the admin, show "Admin Dashboard" link in the header dropdown.

## 4. Testing checklist I'll run before handing back
1. Build passes (`tsgo`).
2. Playwright: open `/business/buy`, fill the form with `mytestfirm.com`, simulate Razorpay test success → confirm `b2b_accounts` + `b2b_gateways` rows via `supabase--read_query`.
3. Playwright: sign up `employee1@mytestfirm.com` → land on `/dashboard` with premium unlocked (no paywall).
4. Visit `/consultation/video` as that user → Soul Machines `<video>` element renders (or surface the SDK error if persona IDs aren't set yet).
5. Visit `/business/dashboard` as the admin → seat counter shows `1 / 50`.

## Out of scope (ask if you want these next)
- Custom-domain SSO (SAML/Okta).
- Auto-generating coupon codes for insurance partners (the old `b2b_coupons` table is left intact, just unused).
- Removing the legacy `b2b_companies` / `b2b_access_rules` tables — I'll leave them so nothing breaks; we can drop them in a cleanup pass.

## Action required from you
1. **Re-attach the 3 YARO/AVA images** — they aren't in the repo, so I can't wire them until you upload them again.
2. Approve this plan so I can request the 4 Soul Machines secrets and run the migration.
