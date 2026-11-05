# WellMindAI — Product Readiness Checklist

Re-usable audit checklist (security, QA, production readiness). Statuses: **PASS** · **FAIL** · **NEEDS REVIEW** · **NOT IMPLEMENTED** · **N/A**.
Last audited: 2026-11-03. Evidence-based — items marked NEEDS REVIEW require a signed-in session, live dashboard access, or a staged environment to verify.

## 1. Authentication & Access Security
| Item | Status | Notes |
|---|---|---|
| Signup / login / logout | PASS | Signup via `direct-signup` edge function (bypasses SMTP limits); session via Supabase Auth |
| Password hashing | PASS | Supabase Auth (bcrypt) |
| Session management & refresh | PASS | Managed by Supabase client |
| OTP / enumeration protection | NEEDS REVIEW | OTP cooldowns implemented client-side; verify server-side limits in dashboard |
| Role-based access control | PASS | `user_roles` table + `has_role()` / `is_super_admin()` SECURITY DEFINER functions |
| Unauthenticated feature access | PASS | Chat / audio / video / journal / counselor routes redirect to sign-in; edge functions (`ai-counselor`, `yaro-tts`, `speech-to-text`, `realtime-voice-session`) reject unauthenticated callers |
| Subscription gating | PASS | Audio/video additionally gated on plan; 15-min free trial hard cutoff |

## 2. Frontend & Client-Side Validation
| Item | Status | Notes |
|---|---|---|
| Input validation | PASS | Zod sanitization on auth and form inputs |
| XSS / safe rendering | PASS | React escapes output; no `dangerouslySetInnerHTML` in user paths |
| Client-side secrets | PASS | Only publishable keys in bundles; `HF_TOKEN`, `OPENAI_API_KEY` server-side only |
| Storage isolation | PASS | Client storage keys scoped by user id (`${KEY}:${user.id}`) |
| Dependency vulnerabilities | NEEDS REVIEW | Run the dependency scan in the Security tab each release |

## 3. Backend & Server-Side Validation
| Item | Status | Notes |
|---|---|---|
| Server-side authz on APIs | PASS | Edge functions verify JWT before acting |
| Never trust client IDs/roles | PASS | Roles resolved server-side via `has_role()` |
| Input schema validation | NEEDS REVIEW | Most edge functions validate; confirm every new function does |

## 4. Application & Infrastructure Security
| Item | Status | Notes |
|---|---|---|
| HTTPS/TLS | PASS | Enforced by hosting + custom domain |
| Secrets management | PASS | `add_secret` vault; no secrets in frontend |
| Rate limiting | NEEDS REVIEW | Lovable has no standard backend rate-limit primitive; sensitive endpoints rely on Supabase Auth limits |
| Database least-privilege | FAIL (High) | 2 RLS findings active (partner_sessions open insert, medications open read). Fix SQL staged at bottom of `.lovable/MIGRATION_RUN_THIS.sql` — run it, then re-scan |

## 5. API Security
| Item | Status | Notes |
|---|---|---|
| Edge function auth checks | PASS | Added to AI/TTS/STT/realtime functions |
| Error surface sanitization | PASS | Functions return generic errors; provider bodies logged server-side |

## 6. Encryption & Data Privacy
| Item | Status | Notes |
|---|---|---|
| TLS in transit / encryption at rest | PASS | Supabase-managed |
| Audit logging (HIPAA-style) | PASS | RLS audit triggers on consultations, prescriptions, medication orders |
| Consent & cookies | PASS | Cookie banner; PostHog persistence downgrades to memory on "reject" |
| Data isolation between users | PASS | RLS on all user tables; storage keys user-scoped |

## 7. Error Handling & Logging
| Item | Status | Notes |
|---|---|---|
| Global error handling | PASS | Error boundary + Toaster in app shell |
| Edge function logging | PASS | Server-side console logs; check function logs in dashboard |

## 8. Database & Data Integrity
| Item | Status | Notes |
|---|---|---|
| Migration safety | PASS | Migrations versioned under `supabase/migrations/` |
| Audit triggers | PASS | Prescription/consultation/medication audit functions |
| Indexing / performance | NEEDS REVIEW | Run Supabase linter + slow-queries check periodically |

## 9. Product Functionality & UX
| Item | Status | Notes |
|---|---|---|
| Core journeys (signup → chat → therapy) | NEEDS REVIEW | Sign-in gating browser-verified; live voice call and PostHog event flow not yet re-verified end-to-end |
| Video therapy (digital avatar) | NEEDS REVIEW | Code restored to working integration; provider credits exhausted at last check — re-test after top-up |
| Placeholder content | FAIL (Medium) | Some demo/sample content and placeholder video embeds remain in secondary components — sweep before launch |
| Responsive layouts | NEEDS REVIEW | Responsive overhaul requested but deferred — complete per the attached spec |

## 10. Open Graph & Link Preview
| Item | Status | Notes |
|---|---|---|
| og:*, twitter:* in static head | PASS | Real title/description/1200×630 `og-preview.png`, absolute https URLs |
| Per-page social previews | FAIL (Low) | SPA limitation — crawlers see the static homepage head only. Needs SSR (TanStack Start migration) |
| Canonical / og:url consistency | PASS | Normalized to `https://wellmindai.in` (non-www) across head, sitemap, robots, JSON-LD |

## 11. Performance & Reliability
| Item | Status | Notes |
|---|---|---|
| Code splitting / lazy loading | PASS | Route-level lazy chunks (Vite) |
| Image optimization | NEEDS REVIEW | Hero scene renders are large portraits — convert to sized WebP for mobile |
| Core Web Vitals | NEEDS REVIEW | Measure with Lighthouse on the published URL |

## 12. Testing & QA
| Item | Status | Notes |
|---|---|---|
| Automated tests | FAIL (Medium) | No unit/E2E suite — add tests for pricing limits, access gating, NPS trigger rules |
| Security scanning | PASS | Lovable security + dependency scans run per change; findings tracked |

## 13. Deployment & Production Readiness
| Item | Status | Notes |
|---|---|---|
| Domain / SSL / redirects | PASS | wellmindai.in live; www + apex both served |
| Secrets in production | PASS | Edge function secrets vault |
| Monitoring & error tracking | NEEDS REVIEW | PostHog captures errors only if enabled — enable `$exception` autocapture in dashboard |
| Backups / recovery | NEEDS REVIEW | Supabase daily backups on paid tier — verify tier |

## 14. Legal & Business Readiness
| Item | Status | Notes |
|---|---|---|
| Privacy policy / terms | NEEDS REVIEW | Verify pages exist and are linked in footer |
| Cookie consent | PASS | Banner with consent-scoped analytics |
| Disclaimers | PASS | "Not a licensed therapist / decision-support" disclaimers present on AI surfaces |
| Payments disclosure | NEEDS REVIEW | Refund/pricing terms visible at checkout — verify copy |

## 15. Action Plan
**Immediate (before launch)**
1. Run the staged security SQL (`.lovable/MIGRATION_RUN_THIS.sql` → last section) and re-scan.
2. Create the PostHog NPS survey (see setup notes) so feedback actually collects.
3. Sweep placeholder content and placeholder video embeds.

**Before launch (next sprint)**
4. Add automated tests: access gating, plan limits, NPS trigger cadence.
5. Complete responsive overhaul + hero image WebP sizing.
6. Verify privacy/terms/refund pages and footer links.

**After launch**
7. Enable PostHog exception autocapture; verify events + NPS survey responses in dashboard.
8. Lighthouse + Supabase linter pass; monitor edge function logs.
9. Google Knowledge Panel: wait for entity consolidation; add verified social URLs to `sameAs`; submit feedback via Google Search Console "Profile" rich result if eligible.

**Decision: READY WITH CONDITIONS** — conditions are items 1–3 above.
