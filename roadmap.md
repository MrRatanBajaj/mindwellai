# WellMindAI roadmap

## Done
- [x] MindCore-3B (HF Space `MrBajaj/mindcore-3b-api`) as primary clinical model
  - [x] Server-side Gradio call from `ai-counselor` with `HF_TOKEN` (verified live)
  - [x] Language auto-detect + same-language reply lock (chat, voice, video all route here)
  - [x] C-SSRS SOS badge + MindCore clinical disclaimer in chat & voice UI
- [x] OG + Twitter card meta with `public/og-banner.jpg`


## Queued
- [ ] Chat with Yaro: new chat interface UI/UX, nav always visible, fix unwanted auto-login redirect
- [ ] About page: remove old content, professional company-style redesign
- [ ] Research page: rebuild, horizontal top cards, mental-health background, related social/research feed
- [ ] Remove routes: `/judgement-free-space`, `/alternative`, `/phone-counselor`
- [ ] Dynamic Prompt Management (`ai_prompts`) + Creator Co-Branding (`creator_partners`), `/admin/prompts`, `/admin/creators`, public `/c/:slug`
- [ ] PostHog analytics (needs project API key from user)

## Security (auto-fix findings)
- [ ] b2b_invites token exposure, blog_posts author_email, prescriptions self-verification
  (migrations blocked → SQL appended to `.lovable/MIGRATION_RUN_THIS.sql`)
