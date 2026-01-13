# Milestone Schedule — High Level

This schedule maps the 10 phases into a pragmatic timeline for a small engineering team (2–4 devs) to deliver an MVP and staged improvements.

Overall estimated timeline: 12–14 weeks to MVP + core features; full product ~ 4–5 months.

Week 0 (Prep)
- Team onboarding, repo access, cloud accounts, keys, and initial infra setup.

Weeks 1–2: Phase 1 & 2
- Final architecture, monorepo setup, root scripts, CI skeleton, developer environment.

Weeks 3–4: Phase 3
- Implement auth, user & job schemas, basic seed data, JWT flows, RBAC middleware.

Weeks 5–6: Phase 4
- Jobs API, public job pages, sitemap generation, search & filters.

Weeks 7–8: Phase 5
- Redis + BullMQ integration, notification engine, adapters and worker processes.

Weeks 9–10: Phase 6
- Frontend polishing, SEO, subscription flows, AdSense integration.

Weeks 11–12: Phase 7
- Playwright-based monitoring, ingestion automation, admin manager for sources.

Weeks 13–15: Phase 8
- LLM integrations (parser, matcher, cover letter) and confidence scoring.

Weeks 16–18: Phase 9
- Admin dashboard, revenue flows, audit logs, GDPR flows.

Weeks 19–20: Phase 10
- Dockerization, CI/CD pipelines, staging deploy, monitoring and production hardening.

Risks & Mitigations
- LLM cost/latency: start with batched parsing and caching; monitor costs.
- Playwright scaling: use crawl scheduling and rate limits; queue work into workers.
- Messaging quotas: use tiered provider accounts and fallbacks.

Team & Roles (suggested)
- 1 Backend Engineer (API, workers, infra)
- 1 Frontend Engineer (React, SEO, UI)
- 1 DevOps/Platform (CI/CD, Docker, deployment)
- 1 QA/Automation (tests, Playwright jobs)
- Optional: ML/AI engineer for prompt engineering and model tuning
