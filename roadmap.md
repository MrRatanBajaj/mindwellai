# WellMindAI roadmap

## In progress
- [ ] MindCore-3B (Hugging Face Space `MrBajaj/mindcore-3b-api`) as primary clinical model
  - [ ] Server-side Gradio call from `ai-counselor` edge function with `HF_TOKEN`
  - [ ] Language auto-detect + same-language reply directive
  - [ ] Chat / voice / video all routed through it
  - [ ] C-SSRS SOS badge + MindCore clinical disclaimer in UI
- [ ] OG + Twitter card meta with preview banner image

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
