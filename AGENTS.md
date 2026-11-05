# AGENTS.md — project rules

- Canonical URLs, `og:url`, `sitemap.xml`, `robots.txt` Sitemap line and JSON-LD entity `@id`/`url`s all use `https://wellmindai.in` (non-www). Why: www and non-www both serve 200s; mixed signals split SEO/OG attribution.
- Feedback collection is PostHog-native only (`PostHogNps` fires `nps_survey_opportunity`, then shows the dashboard survey). Why: user explicitly removed the custom in-app NPS widget; do not reintroduce one.
- Organization JSON-LD contains only verified inputs (Wikidata Q141582620, official logo, founder Ratan Bajaj). Why: fabricated founding dates/social URLs harm Knowledge Panel eligibility — add `sameAs` links only when the user supplies verified profiles.
