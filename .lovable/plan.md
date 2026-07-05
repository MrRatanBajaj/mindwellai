# WellMindAI — Scope of this build

## 1. Database migration (one SQL file, you run it)
Adds to `.lovable/MIGRATION_RUN_THIS.sql`:
- `app_role` enum (`admin`, `moderator`, `user`) + `user_roles` table + `has_role()` security-definer function.
- `research_papers` table (title, slug, authors, abstract, pdf_url, published_at, tags).
- `demo_access_grants` table (user_id, granted_by, expires_at, is_active) — powers 1-day full-feature demos.
- `invoices` table (user_id, invoice_no auto-seq, amount, plan, razorpay_payment_id, issued_at).
- GRANTS + RLS on all of the above.
- Seeds your email as first `admin` role.

## 2. Admin panel (`/admin`)
Single page, role-gated via `has_role(auth.uid(),'admin')`:
- Tabs: Blog posts | Research papers | Careers/Job applications | Leads | Demo access | Invoices.
- Full CRUD for blog + research papers (title, slug, cover, markdown body, publish toggle).
- Careers: view/edit `job_applications` rows, mark reviewed.
- Leads: view `leads` + `content_drafts`.
- Demo access: input email → grants 24-hour full-feature access (adds row to `demo_access_grants`).
- All non-admin users redirected to `/dashboard`.

## 3. Yaro chat fix
- Rewire `YaroChat.tsx` to call existing `ai-counselor` edge function (already on Lovable AI Gateway → `google/gemini-3-flash-preview`, multi-modal, Hindi/Hinglish native).
- Restore the earlier working chat therapy prompt (clinical DSM-5/PHQ-9/GAD-7/PCL-5 pattern engine) inside `ai-counselor`.
- Fix `/chat/yaro` page width: constrain to `max-w-2xl mx-auto` with WhatsApp-style card, not full-viewport wide.
- Keep name "Yaro" everywhere.

## 4. Invoice generation
- New `src/lib/invoice.ts` — client-side PDF via `jspdf` (already common dep, will add if missing).
- WellMindAI logo + name header, invoice number, plan, amount, GST-ready format.
- `Subscription.tsx` gets "Download Invoice" button per payment row.
- On successful Razorpay verify, `verify-payment` edge function inserts an `invoices` row.

## 5. Page removals (delete files + routes + nav links)
- Delete: `src/pages/Business.tsx`, `src/pages/B2BTestAccess.tsx`, `src/pages/Referrals.tsx`, `src/pages/BlogPost.tsx`.
- Remove routes from `App.tsx`: `/business`, `/business/test-access`, `/referrals`, `/blog/:slug`.
- Any link pointing to `/business` → repoint to `/business/buy`.
- Remove nav links to Referrals and Blog-post detail. Blog listing stays.

## 6. `/business/buy` — make it fully functional
- Already scaffolded. Fix: Pay & Activate opens Razorpay directly with seat pricing, on success calls `b2b-activate` which is already wired to verify signature + create account + gateway. Test end-to-end.
- Ensure `VITE_RAZORPAY_KEY_ID` fallback reads from Supabase-injected env; if missing, show clear error not silent fail.

## 7. Landing page content overhaul
- Remove ALL student-specific copy (pain-point grid, "student pricing", "campus" mentions).
- Remove "Panda" text everywhere. Where mascot is referenced, keep the 3D mascot visual but never label it "Panda" — it's just the WellMindAI companion. Human names remain Yaro (male) / Ava (female).
- Rewrite hero + sections around universal audience: grief counselling, anxiety, workplace stress, relationships, sleep, general mental wellness.
- Add dedicated "Grief Counselling" section with copy + CTA to `/chat/yaro`.
- Remove the symbolic-only decorative page/section flagged (locate and remove any orphan `symbol`/decorative-only route).

## 8. Competitor pages fix
- Verify `/alternatives/wysa-alternative`, `/alternatives/lyra-health-alternative`, `/alternatives/whisper-alternative` all render (route is `/alternatives/:slug`, page reads slug).
- Confirm entries exist in `public/sitemap.xml` and internal footer links.

## 9. Cleanup
- Remove "Panda" string from `Index.tsx`, `PsychologyHero.tsx`, any component/asset naming.
- Remove `student` copy from `Pricing.tsx`, `Plans.tsx`, `Payment.tsx`.

## Files to touch (approx)
Create: `src/pages/Admin.tsx`, `src/components/admin/*` (4 tabs), `src/lib/invoice.ts`, `src/hooks/useAdmin.tsx`.
Edit: `.lovable/MIGRATION_RUN_THIS.sql`, `src/App.tsx`, `src/components/layout/Header.tsx`, `src/components/layout/LandingNav.tsx`, `src/components/layout/Footer.tsx`, `src/pages/Index.tsx`, `src/components/ui-custom/PsychologyHero.tsx`, `src/components/ui-custom/YaroChat.tsx`, `src/pages/Subscription.tsx`, `src/pages/Plans.tsx`, `src/pages/Payment.tsx`, `src/components/ui-custom/Pricing.tsx`, `src/pages/B2BBillingEngine.tsx`, `supabase/functions/ai-counselor/index.ts`, `supabase/functions/verify-payment/index.ts`, `public/sitemap.xml`.
Delete: `src/pages/Business.tsx`, `src/pages/B2BTestAccess.tsx`, `src/pages/Referrals.tsx`, `src/pages/BlogPost.tsx`.

## Action you must take after
Run the updated `.lovable/MIGRATION_RUN_THIS.sql` in Supabase SQL editor. Everything else deploys automatically.

Approve to proceed, or tell me what to change.
