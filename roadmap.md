# WellMindAI roadmap

## Done
- [x] MindCore-3B (HF Space `MrBajaj/mindcore-3b-api`) as primary clinical model
  - [x] Server-side Gradio call from `ai-counselor` with `HF_TOKEN` (verified live)
  - [x] Language auto-detect + same-language reply lock (chat, voice, video all route here)
  - [x] C-SSRS SOS badge + MindCore clinical disclaimer in chat & voice UI
- [x] OG + Twitter card meta with real 1200×630 `og-preview.png`
- [x] PostHog analytics: connector linked, auto pageviews, person profiles always, funnel + page-duration events
- [x] Sign-in + subscription gating on chat/audio/video routes; edge functions reject unauthenticated callers
- [x] Custom in-app NPS prompt removed → PostHog-native survey trigger (`PostHogNps` + `nps_survey_opportunity`)
- [x] Search discoverability: consolidated Organization/WebSite/SoftwareApplication JSON-LD (verified inputs only),
      canonical/sitemap/robots normalized to https://wellmindai.in (non-www), OAI-SearchBot allowed, sitemap line fixed

## Queued
- [ ] Responsive UI overhaul (per uploaded spec) — deferred
- [ ] Partner network booking flow: emails/calendar, branded payment QR polish
- [ ] Video therapy: re-test Tavus flow after provider credit top-up (code restored, credits exhausted at last check)
- [ ] Automated tests: access gating, plan limits, NPS trigger cadence
- [ ] Per-page social previews need SSR (offer TanStack Start migration)

## Blocked (waiting on user)
- [ ] Security RLS fix (partner_sessions insert, medications read): migration tool blocked by approval
      preference → SQL staged at the bottom of `.lovable/MIGRATION_RUN_THIS.sql`; run it, then re-scan
- [ ] PostHog NPS survey must be created in the PostHog dashboard (event: `nps_survey_opportunity`)
- [ ] Verified company social profile URLs for Organization `sameAs` (Knowledge Panel)
- [ ] Google/Bing manual steps: Search Console sitemap submit, Bing Webmaster Tools
