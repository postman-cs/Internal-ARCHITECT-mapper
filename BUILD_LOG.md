# Build Log: Internal-ARCHITECT-mapper

## Context
- AE / CSE: Daniel Shively (CSE)
- Customer technical lead: Internal tooling — used during customer engagements
- Sprint dates: Ongoing

## Hypothesis
- If we build an interactive architecture capture tool with shareable customer links, we will prove that structured architecture mapping accelerates CSE discovery and produces higher-quality service templates and topology graphs.

## Success Criteria
- Consultants can capture a customer's full technology landscape (SCM, CI/CD, gateway, cloud, identity, monitoring, etc.) through guided forms
- Service catalog entries generate OpenAPI-style service constellation YAML
- Customers can fill out their own architecture details via tokenized public links without needing an account
- Submitted maps produce topology graphs, phase artifacts, and POC deliverables automatically

## Environment Baseline
- SCM: GitHub (postman-cs/Internal-ARCHITECT-mapper)
- CI/CD: Vercel (auto-deploy on push to main)
- Gateway: N/A
- Cloud: Vercel (frontend + serverless), PostgreSQL (database)
- Dev Portal: N/A
- Current Postman usage: Webhook integration for architecture data ingest; service templates reference Postman workspace strategy
- v11/v12: N/A (internal tool)

## What We Built
- Next.js 15 web app (React 19, Tailwind 4) branded as "CortexLab Architecture Mapper"
- Interactive architecture capture forms: source control, CI/CD, API gateway, cloud, identity/auth, secrets, monitoring, spec hosting, observability, Postman workspace strategy
- Service catalog builder with domains, repos, specs, environments, and governance stages
- Topology graph generator (nodes/edges with Postman integration hints)
- Shareable tokenized links for customer self-service architecture submission
- Webhook endpoints for external tool integration and public form submissions
- PostgreSQL database via Prisma ORM with projects, artifacts, topology, proposals
- Iron-session auth, bcrypt passwords, rate limiting, security headers
- XP/gamification engine for engagement milestones
- AI document ingest stub (chunking and evidence labeling)
- Phase artifact generation (DISCOVERY, CURRENT_TOPOLOGY) feeding into downstream cascade

## Value Unlocked
- Structured architecture capture replaces ad-hoc notes and spreadsheets
- Auto-generated service templates and topology graphs save hours of manual work
- Customer self-service links reduce back-and-forth during discovery
- Data feeds directly into AI pipeline for automated brief generation

## Reusable Pattern
- Tokenized public form pattern for customer data collection without auth
- Architecture questionnaire structure (reusable across any enterprise engagement)
- Service constellation YAML generation from catalog data
- Webhook-based integration between architecture mapper and AI pipeline

## Product Gaps / Risks
- Cascade impact analysis is stubbed (not fully implemented in standalone mode)
- AI ingest pipeline runs without embeddings in standalone mode
- Single-tenant auth model limits multi-team usage
- "Architecht" typo in package/folder name persists from initial creation

## Next Step
- Integrate deeper with AI pipeline for automated discovery brief generation from architecture maps
- Add multi-tenant support for team-based access
- Build export functionality for architecture maps (PDF, Confluence, Postman)
