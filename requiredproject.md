You are a Principal Software Architect, Senior Full-Stack MERN Engineer, and AI Product Designer. Your task is to DESIGN and GENERATE a COMPLETE, PRODUCTION-READY MERN STACK WEB APPLICATION.

==================================================== PROJECT NAME
Job Intelligence, Automation & Notification Platform

==================================================== CORE VISION
Build a highly scalable, SEO-friendly job platform that:

Detects job postings early from company career pages
Automatically structures job data using AI
Matches jobs to user profiles
Sends instant notifications via: ✔ WhatsApp ✔ Email ✔ Telegram
Minimizes admin effort
Saves maximum time for job seekers
Supports monetization via Ads, Subscriptions, Referrals
==================================================== USER TIERS
1️⃣ FREE USERS

No signup required to browse jobs
Ads enabled
Public SEO-friendly job pages
Basic filters (role, company, location)
CTA to upgrade
2️⃣ PREMIUM USERS

Signup/Login required
No ads
Personalized job matching
Early job access
Notifications via: ✔ WhatsApp ✔ Email ✔ Telegram
Job bookmarking
Manual application tracking
3️⃣ ULTRA-PREMIUM USERS

Smart AI job matching with confidence score
Consent-based assisted auto-apply
Resume version selection
AI cover letter generation
Daily auto-apply limits
Full application tracking
Proof of application (confirmation ID / screenshot)
Application success analytics dashboard
Highest priority notifications on all channels
==================================================== TECH STACK (STRICT – MUST FOLLOW)
FRONTEND

React (Vite)
Tailwind CSS
Redux Toolkit
React Router
SEO-optimized meta tags
Dynamic sitemap.xml
JobPosting schema markup
Google AdSense (Free users only)
BACKEND

Node.js
Express.js
MongoDB with Mongoose
JWT Authentication (access + refresh tokens)
Role-based access control
Redis (caching + queues)
BullMQ (background jobs & notifications)
Nodemailer (Email notifications)
WhatsApp Cloud API
Telegram Bot API
Playwright (career page monitoring & assisted automation)
AI SERVICES

AI Job Parser (raw JD → structured data)
AI Resume-Job Matcher
AI Cover Letter Generator (Ultra-Premium)
DEVOPS / PROD

Docker support
Environment-based configs
Rate limiting
Secure headers
Production-ready logging
Error handling & retries
==================================================== NOTIFICATION SYSTEM (MANDATORY)
Unified Notification Engine that supports:

Email
WhatsApp messages
Telegram bot messages
Features:

User-level notification preferences
Channel fallback logic (if WhatsApp fails → Email)
Priority routing for Ultra-Premium users
Event-based triggers:
New job matched
Job deadline reminder
Auto-apply completed
Referral update
==================================================== ADMIN FEATURES (ZERO MANUAL WORK GOAL)
Admin Dashboard:

Secure admin login
Role-based permissions
AI-powered one-paste job posting: Admin pastes raw job text or link → system auto-fills:
Company
Role
Eligibility
Batch
Location
Experience
CTC
Apply link
Deadline
Job approval workflow
Company career page monitoring manager
ATS watcher manager (Greenhouse, Workday, Lever, etc.)
Notification broadcast control (WhatsApp / Email / Telegram)
Revenue analytics (Ads + Subscriptions + Referrals)
==================================================== AUTOMATION ENGINE
Job Intake Pipeline: Career Page / ATS → Change Detection → Job Extraction → AI Structuring → Admin Approval (optional) → Database → User Matching → Notification Engine

Auto-Apply Logic:

Eligibility check
Match confidence score
Feasibility detection: ✔ Fully automated ✔ Semi-automated ✔ Manual required
Explicit user consent logging
Rate-limited & ethical automation only
==================================================== REFERRAL SYSTEM
Verified employee referrers
Paid referral requests
Escrow-style flow
Admin commission model
Transparent & ethical workflow
Referral status tracking
Notifications on each update
==================================================== SEO & GROWTH
SEO-friendly public job pages
Company profile pages
JobPosting schema
XML sitemap generation
Fast load performance
Social share previews
Indexable routes (no JS blocking)
==================================================== MONETIZATION
Google Ads (Free users only)
Subscription plans: Free / Premium / Ultra-Premium
Referral commission
Future enterprise & college onboarding support
==================================================== FOLDER STRUCTURE (MANDATORY)
Root │ ├── frontend/ │ ├── src/ │ │ ├── components/ │ │ ├── pages/ │ │ ├── layouts/ │ │ ├── hooks/ │ │ ├── redux/ │ │ ├── services/ │ │ ├── utils/ │ │ ├── seo/ │ │ └── main.jsx │ └── index.html │ ├── backend/ │ ├── src/ │ │ ├── controllers/ │ │ ├── models/ │ │ ├── routes/ │ │ ├── services/ │ │ ├── jobs/ │ │ ├── notifications/ │ │ ├── middlewares/ │ │ ├── utils/ │ │ ├── config/ │ │ └── server.js │ ├── docker/ ├── docs/ └── README.md

==================================================== SECURITY & COMPLIANCE
JWT + refresh tokens
Rate limiting
Consent storage for auto-apply
GDPR-friendly data handling
No captcha bypassing
Ethical scraping only
Audit logs for admin actions
==================================================== DELIVERABLES REQUIRED
Full frontend code
Full backend code
Database schemas
API documentation
Notification workflows
Sample .env files
README with setup & deployment steps
Production best practices
IMPORTANT:

No placeholder logic
Clean, scalable, startup-grade code
Everything interconnected
Think like a real SaaS founder + architect
START BY:

Architecture overview
Database schema
Backend APIs
Notification system
Frontend UI
Automation services