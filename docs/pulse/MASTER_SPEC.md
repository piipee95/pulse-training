# PULSE Training — Master Product Specification

**Document:** PULSE-MASTER-SPEC | **Version:** V0.9 draft 1 | **Date:** 2026-10-28
**Status:** Functional baseline V0.1–V0.8.1 approved; technical implementation pending.
**Repository:** https://github.com/piipee95/pulse-training
**Upstream:** https://github.com/DuarteSantos8/openGym

## 1. Purpose and product boundaries
PULSE Training is an open-source, mobile-first, multi-user fitness platform derived from openGym. Its distinctive experience combines structured workout logging with context-aware, explainable, user-approved suggestions during each set. Desktop and tablet remain fully supported.

This document describes **requirements**, not functionality already implemented in the fork. The fork initially retains upstream code; no PULSE feature is implied to exist until demonstrated by tests and reviewed code.

## 2. Approved decisions
- Public, free registration, without invitation or manual approval; verified email and account recovery are required for a production public service.
- Each user has an independent sports profile, routines, sessions, progression and privacy settings.
- Reference onboarding preset: hypertrophy, intermediate, four days per week, gym. This is an example, **not** a mandatory global profile.
- Three complementary experiences: quick logging, assisted training and optional conversational coach. All share the same canonical session history.
- Weekly fixed or flexible rotation planning, edited templates, exercises substitutions, time-constrained sessions and per-session vs permanent routine changes.
- Default sports privacy: profile visible to accepted friends; routine sharing enabled; activity sharing enabled; weights/load sharing disabled. Explicit permission governs each audience and field.
- Friends, private groups, copied shared routine templates, optional activity feed and challenges are staged after the secure training core.
- Admin tooling manages accounts, moderation, platform configuration, audits and health; admin rights do not automatically permit browsing private workouts.
- UX direction: **mobile-first**; dark theme by default plus full light theme; provisional name PULSE, Carbon/Volt palette. Naming and trademark availability remain unverified.
- Preserve upstream functionality, attribution, license obligations and synchronization/offline behavior. Minimize new dependencies, avoid paid APIs as requirements.

## 3. Canonical workout experience
1. User selects today's routine or a workout from rotation.
2. App displays recent performance, target sets, rep range, target RIR, rest guidance and optional exercise technique.
3. During each set, user records exercise ID, load and unit, repetitions, optional RIR/RPE, technique/effort notes, rest and timestamp.
4. Save each confirmed set locally immediately, including when offline; synchronize without silent data loss.
5. Assisted mode evaluates the newly entered data and issues one concise suggestion plus explanation; user can accept, modify or ignore it.
6. User can swap exercises, add sets, edit records and resume an interrupted session.
7. End-of-session summary displays actual results, planned-vs-actual differences, trends, PRs with method labels and recommendations for later sessions.

**Data integrity:** distinguish plan, performed facts, computed metrics and recommendations. Never rewrite workout history when progression rules change. Do not treat missing RIR as zero. No silent automatic weight changes.

## 4. Recommendation engine — requirements
- Deterministic, testable policy engine first; optional AI/NLP only augments explanations or interpreting notes.
- Inputs: exercise, working sets, reps, load, RIR/RPE when provided, target ranges, technique flags, rest, recent comparable sessions, equipment and user profile.
- Possible outputs: keep load, consider increase, reduce load, increase rest, review technique/recovery, or stop exercise.
- Each suggestion records input references, rule version, rationale, timestamp and user response.
- Evaluate double progression across comparable sessions. Do not trigger a new load merely from one unusually good set.
- If user reports unexpected pain, stop exercise guidance supersedes progression; no diagnosis.
- Support new users with limited history without fabricating confidence or fatigue scores.
- Preserve the original openGym progression engine where possible; avoid conflicting parallel progression decisions. Audit implementation prior to extension.

## 5. Routines and onboarding
Users can create routines from scratch, import/copy existing templates, or generate editable rule-based starter plans. A plan defines sessions, exercise variants, ordering, target sets/reps, optional RIR, rest and substitute equipment. Users can reschedule without losing history. Changes may apply only to the current workout or future templates, explicitly selected.

## 6. Accounts, privacy and community
### Public registration P0
Secure authentication, verified email, recovery, anti-abuse/rate limits, secure transport, session management, export and deletion workflows. Assess upstream passkeys and profile system before extending it. Opening registration must be gated on authorization and security tests.
### Data access
Private by default. Every backend access verifies record ownership or specific, revocable sharing grants. Friendship or group membership alone never confers comprehensive data access.
### Community P1
Friend requests/acceptance/rejection/blocking; invitation-based private groups; shared routine templates omit personal loads and history; shared activity limited to explicitly enabled details and audience. Allow removing consent and leaving groups.
### Administration P0
Account status and moderation, audit trail, infrastructure diagnostics and configuration. Sensitive destructive actions require confirmation and authorization. Administrative metadata must be separated from users' private sports records.

## 7. UX system and responsive behavior
- Product name: PULSE (provisional); visual language: premium, restrained, functional.
- Dark tokens (starting proposal): Carbon #11151B, Slate #222A34, Volt #B8F255, Cloud #F5F7F9, Steel #778397. Light theme uses darker accessible green for text and primary controls.
- Use semantic design tokens, consistent typography, responsive spacing, tabular numeric figures and clear input validation.
- Mobile workout screen prioritizes current exercise, numeric set entry, rest timer, compact suggestion and one-hand touch targets. No unnecessary scrolling or horizontal overflow.
- Mobile navigation: Home, Plan, Train, Progress, Community; profile via top-level access. While training, minimize distractions.
- Desktop: responsive sidebar, multi-column history/analytics and full feature parity.
- Include accessible focus management, contrast, keyboard support, reduced motion, loading/empty/error states and offline/conflict UI.
- Do not add several competing component frameworks. Review current CSS/components before choosing Lucide, Radix, form or chart dependencies.

## 8. Existing technical baseline — verify on implementation
Upstream release reflected in fork frontend/package.json: 1.4.3. React 19, Vite 8, React Router 7, Zustand 5, Capacitor 8, Vitest 4. API uses Node.js; original persistence is JSON. Treat these as an initial observed snapshot, not a guarantee of readiness for public-scale users.

Potential additions require an explicit ADR: accessible component primitives, icons, browser E2E testing, validation and charting. No framework rewrite without demonstrated need.

## 9. Security, legal and operational gates
- Keep upstream notices and AGPL-3.0 obligations; perform a dedicated inventory of bundled images/animations, third-party assets and redistribution rights.
- Prevent cross-user reads/writes with direct object authorization tests.
- Verify rate limiting, signup abuse protections, recovery flows, TLS, secret management, backup/restore, production deployment and log retention.
- Test interrupted sessions, simultaneous devices, conflicting edits, offline recovery and sync merges. No public launch until P0 criteria pass.
- Do not silently change upstream license, strip credits, or assume all media are licensed identically to source code.
- Avoid uncontrolled hosting or paid provider dependencies.

## 10. Delivery sequencing
**Foundation V0.9:** audit fork/upstream SHA, licenses, existing tests, design tokens, data contracts; documentation only; review PR.
**Core:** mobile responsive training and canonical reliable set logging, preserving upstream operation.
**Engine:** deterministic recommendations, action logging, progression validation.
**Public accounts:** signup and verification, secure per-user authorization, admin and backup/restore; security gate before publishing.
**Community:** friends, privacy, sharing and private groups.
**Release:** automated unit/integration/E2E checks, mobile device testing, observability, deployment and rollback plan.
Dependencies between phases override presentation order: public exposure is never permitted before account/security gates.

## 11. QA acceptance
- Two independent accounts cannot read or mutate each other's private data even by changing resource IDs.
- Saved sets survive network loss, app restart and synchronization; conflicts do not silently drop workouts.
- Recommendations have versioned traceable inputs, explain their output and do not alter loads without confirmation.
- Core paths work on narrow phones and desktop with both themes, keyboard focus and no horizontal clipping.
- Historical imports are explicitly labeled verified/partial/estimated; no fabricated logs.
- Existing upstream test suite remains green and new modules have targeted tests.
- Backups are both created and restorable in a controlled test environment.

## 12. Governance
Status labels: **proposed / approved requirement / implemented / tested / production verified**. Never conflate approval with implementation. One focused branch and PR per goal; do not commit experimental changes directly to main. Document upstream synchronization and compatibility decisions. The main README may be reworked only after retaining origin and legal acknowledgments.

## 13. Next companion documents
- ARCHITECTURE.md
- DESIGN_SYSTEM.md
- TRAINING_ENGINE.md
- SECURITY.md
- ROADMAP.md
- UPSTREAM.md

This specification captures the approved direction of the design conversation as of 2026-10-28. Code-level decisions remain subject to independent audit and proof.
