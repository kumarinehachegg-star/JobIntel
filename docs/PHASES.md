# JobScout — 10-Phase Development Plan

This document describes the 10 phases to convert the current repo into the production-ready "Job Intelligence, Automation & Notification Platform". Each phase lists objectives, deliverables, tasks, required inputs, acceptance criteria and estimated timeline.

Phase 1 — Architecture & Roadmap (1 week)
- Objective: Finalize high-level architecture and milestone plan.
- Deliverables:
  - Architecture overview document (component diagram, sequence flows)
  - Initial infra recommendations (cloud provider, managed services)
  - Milestone schedule and risks
- Tasks:
  - Draft architecture and sequence diagrams
  - List required external services (SMTP, WhatsApp Cloud, Telegram, LLM provider)
  - Collect constraints (budget, scale targets)
- Inputs needed from product owner:
  - Preferred cloud provider (AWS/GCP/Azure)
  - Target scale (jobs/day, users)
  - Budget constraints
- Acceptance:
  - Signed-off architecture doc and prioritized milestone list

Phase 2 — Monorepo & Dev Workflow (2–4 days)
- Objective: Standardize repo layout and developer experience.
- Deliverables: root `package.json` (workspaces), `Makefile` or root `dev` script, GitHub Actions skeleton, linting/format config.
- Tasks:
  - Add workspace tooling (pnpm recommended)
  - Add root scripts to run frontend+backend locally
  - Add basic CI pipeline (lint/test/build)
- Inputs: package manager preference (npm/pnpm/yarn)
- Acceptance: `npm run dev` from repo root starts both services for local dev.

Phase 3 — Data Model & Auth (1 week)
- Objective: Create canonical database schemas and authentication system.
- Deliverables: Mongoose models (User, Job, Company, Application, Referral, NotificationLog), JWT auth, RBAC middleware.
- Tasks: design schemas, implement auth endpoints (signup/login/refresh), seed data, Postman collection.
- Inputs: required user profile fields, billing fields, referral payout rules.
- Acceptance: Auth + RBAC endpoints passing tests.

Phase 4 — Core Backend Services (Jobs API & Ingestion) (2 weeks)
- Objective: Production-grade Jobs API and ingestion pipeline interface.
- Deliverables: Job CRUD API, public SEO endpoints, OpenAPI spec, ingestion adapters.
- Tasks: controllers, routes, sitemap endpoint, static job pages generator.
- Acceptance: Public job pages reachable and indexed (sitemap generated).

Phase 5 — Notifications & Background Jobs (2 weeks)
- Objective: Unified Notification Engine using Redis + BullMQ.
- Deliverables: Worker processes, adapters (Email, WhatsApp, Telegram), fallback logic, notification preference store.
- Tasks: implement notification flows, priority routing, retries, and monitoring.
- Inputs: SMTP + WhatsApp + Telegram credentials (or test mocks)
- Acceptance: Demo flow with fallback and retry.

Phase 6 — Frontend Core & SEO (2–3 weeks)
- Objective: Polished front-end with SEO best practices and subscription flows.
- Deliverables: Frontend scaffold (components, pages, seo folder), sitemap generator, JobPosting JSON-LD.
- Tasks: implement public job pages, auth flows, subscription UI, Google AdSense integration for free users.
- Acceptance: SEO meta + JSON-LD present on public job pages.

Phase 7 — Automation & Scraping Engine (Playwright) (2–3 weeks)
- Objective: Passive and safe monitoring of career pages and ATS feeds.
- Deliverables: Playwright-based watchers, change detection, ingestion uploader, admin manager UI.
- Tasks: implement safe crawling, delta detection, scheduling, admin interface for sources.
- Inputs: source list, any credentials for protected sources (optional).
- Acceptance: At least one live career page monitored and new jobs ingested.

Phase 8 — AI Services Integration (3 weeks)
- Objective: LLM-powered Job Parser, Matcher, and Cover Letter generator.
- Deliverables: API endpoints for parsing and matching, confidence scoring, prompt engineering docs.
- Tasks: implement microservices that call LLMs, caching and validation, offline fallback.
- Inputs: LLM provider (OpenAI/Azure/other) and API key.
- Acceptance: Sample parsing accuracy on test set.

Phase 9 — Admin Dashboard, Revenue & Compliance (2 weeks)
- Objective: Full admin UX to manage ingestion, approvals, revenue analytics and audits.
- Deliverables: Admin UI for approvals, crawler manager, revenue reports, audit logs, GDPR deletion flows.
- Tasks: role-based admin routes, reports, payouts, audit trail.
- Acceptance: Admin can approve jobs and run crawler jobs from UI.

Phase 10 — CI/CD, Docker, Prod Hardening & Launch (2 weeks)
- Objective: Production-grade deployment, monitoring, and runbooks.
- Deliverables: Dockerfiles, k8s/compose manifests, CI deploy pipelines, logging and monitoring setup, TLS and secrets management.
- Tasks: create Docker images, automated deploy to staging, smoke tests, create runbook.
- Acceptance: CI builds images, deploys to staging and passes smoke tests.

Appendix: Acceptance Checklist (for each phase)
- Architecture doc reviewed
- Code committed and pushed with tests where applicable
- README updated with run instructions
- CI pipelines added for build/test
- Security checklist completed (rate limiting, headers, secrets)
