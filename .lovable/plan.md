## Scope (confirmed)

Palette: Soft Peach `#F7D9C4` + Sage `#C9D9B8` + Cream `#F4E7D3` + Ink `#3A3A3A`. Oil-pastel "drawn by mom" aesthetic — hand-drawn strokes, paper grain, crayon textures, soft shadows. Less text, more space, no "AI-generated" vibe.

Counselors: only two — **YARO** (male) and **AVA** (female). User will supply Tavus persona IDs later; I'll wire env vars `VITE_TAVUS_PERSONA_YARO` and `VITE_TAVUS_PERSONA_AVA` and leave clear TODO. Beautiful realistic Tavus replicas.

Server enforcement: **edge function gate + auto-cutoff** combo for safety on a paid resource (Tavus minutes are real money).

---

## 1. Design system overhaul (`src/index.css`, `tailwind.config.ts`)

- Replace HSL tokens with oil-pastel palette:
  - `--background: 28 70% 87%` (peach)
  - `--surface: 36 60% 90%` (cream)
  - `--accent-sage: 86 27% 78%`
  - `--foreground: 0 0% 23%` (ink)
  - `--primary: 14 55% 55%` (warm terracotta accent)
- Add textures: paper-grain SVG bg, crayon-stroke SVG borders, wobbly hand-drawn dividers (CSS `clip-path` + SVG filters).
- Fonts: `Caveat` (handwritten accents) + `Fraunces` (serif display) + `Nunito` (body). Install via `@fontsource`.
- Global utility classes: `.crayon-border`, `.paper-bg`, `.pastel-card`, `.hand-underline`.

## 2. Page deletions

Delete files + routes + nav links:
- `src/pages/Research.tsx`
- `src/pages/LeadsAdmin.tsx`
- `src/pages/NotificationAdmin.tsx`
- `src/pages/Admin.tsx`
- `src/pages/AuditLogs.tsx`
- `src/pages/PartnerProgram.tsx`
- `src/pages/StudentAmbassador.tsx`
- `src/pages/FeedbackWall.tsx`
- `src/components/ui-custom/FeedbackForm.tsx`
- Remove their routes from `src/App.tsx` and links from `Header.tsx` / `Footer.tsx`.
- **Keep**: Blog, BlogPost, Referrals.

## 3. Counselors → YARO & AVA only

- New `src/lib/counselors.ts` — exports `[YARO, AVA]` with: name, tagline, tavusPersonaId (env), elevenLabsVoiceId, accent.
- Rewrite `src/pages/Consultation.tsx` — two big hand-drawn cards, instant Video / Voice CTAs.
- `TavusVideoConsultation.tsx` accepts personaId prop.
- `ElevenLabsPhoneCounselor.tsx` mapped: YARO → `onwK4e9ZLuTAKqWW03F9` (Daniel), AVA → `EXAVITQu4vr4xnSDxMaL` (Sarah).

## 4. Page-by-page redesign

Apply oil-pastel system to every remaining page. New shared components: `<PastelHero>`, `<CrayonCard>`, `<PaperSection>`.

- **Index** (landing): peach-sage split background, big handwritten headline "you, gently held.", one paragraph, two CTAs (Talk to AVA / Talk to YARO), three crayon cards.
- **Auth**, **Dashboard**, **Journal**, **Consultation**, **PhoneCounselor**, **Sessions**, **Subscription/Plans/Pricing**, **Payment**, **PaymentHistory**, **Referrals**, **About**, **Careers**, **Policy**, **Emergency**, **Blog/BlogPost**, **NotFound** — all reskinned with paper bg, crayon borders, handwritten headings.

## 5. Server-side video limit enforcement

### Migration
```
create table public.video_usage(
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  plan_id text not null,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  seconds int default 0,
  conversation_id text,
  counselor text
);
+ grants + RLS (user reads own, service writes)
+ index (user_id, started_at desc)
```

### New edge function `video-session-gate` (POST)
Actions:
- `start`: read JWT user, fetch active subscription, compute month usage from `video_usage`, enforce:
  - free → max 1 session ever, max 120s
  - premium → ≤3 sessions/month AND total ≤720s AND per-session ≤240s
  - pro_ultimate → ≤6 sessions/month AND total ≤1800s AND per-session ≤300s
  - returns `{ allowed, maxSeconds, tavusConversationUrl }` (delegates to existing `tavus-conversation`)
- `heartbeat`: updates `seconds`; returns `shouldEnd` when limit hit.
- `end`: finalizes `ended_at` + `seconds`.

### Client (`TavusVideoConsultation`)
- Call `start` instead of `tavus-conversation` directly.
- Ping `heartbeat` every 15s; when `shouldEnd` → force-end call + toast "Time's up — upgrade for more".
- Call `end` on unmount/hangup.

## 6. Security findings (auto-fix)

- `b2b_invites`: replace `USING (true)` with `email = (select email from profiles where user_id = auth.uid()) OR exists(admin membership)`.
- `realtime.messages`: drop blanket policies, add per-topic policies scoped by `auth.uid()` (topic must include the user id or session id).

---

## Out of scope (will NOT do this turn)

- New canvas/PDF artwork.
- ElevenLabs language switcher (already English-only).
- Removing Blog/Referrals.
- Backend changes to journaling/peer/memorial.

Approve and I'll execute end-to-end. This is a large multi-file refactor; expect significant credit usage.