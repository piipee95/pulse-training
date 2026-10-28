# PULSE — Baseline technical audit (remote inspection)

**Date:** 2026-10-28
**Status:** Partial source inspection only. No install, build, test execution, production security review or deployment.
**Repository:** piipee95/pulse-training
**Reference branch for documentation:** docs/pulse-v090-foundation
**Fork original main at comparison:** 5fdb229fe40d2299ba0c82b84c86259d73944aba

## Sources inspected
- Original docs/ARCHITECTURE.md
- frontend/package.json and api/package.json
- frontend/src/index.css (beginning, design tokens and theme)
- frontend/src/store/useStore.js (beginning, persisted state and synchronization metadata)
- frontend/src/lib/sync-merge.js (beginning, revision conflict and field merge rules)
- api/server.js (beginning, auth and deployment flags)
- Repository-level license and project overview
These excerpts are not a comprehensive audit of each module.

## Observations
### UI/UX — reuse instead of rewrite
Existing index.css already defines dark default semantic tokens, a light theme based on data-theme, an account accent system, geometry and animation timing, plus safe-area/connection banner support. PULSE Carbon/Volt should be an additional controlled brand theme or mapped tokens, not a second competing CSS framework. Avoid breaking account theme preferences and locale accessibility.
**To inspect:** full styles, views, component library, accessibility tests and current mobile navigation before changing design.

### Workout persistence — critical invariants
useStore uses Zustand; source shows locally persisted state identifiers, server base revisions, dirty-state markers, an owner-specific device write guard and an offline stash for pending changes. Mobile native mirroring is referenced. Do not create independent persisted PULSE workout sets without the existing event/save path.
**To inspect:** the exact workout object shape and set edits (session-edit.js), action methods and offline reconciliation flow.

### Sync/merge — high regression risk
sync-merge.js documents per-field timestamps, owner/revision separation, union of workouts/routines and record-level correction semantics. PULSE recommendation metadata needs well-defined conflict rules; naive new arrays added to user state could be overwritten on device synchronization.
**To inspect:** complete merge helpers and their test matrices before adding schema.

### Auth/public signup — safe defaults not sufficient for public production
api/server.js explicitly supports passkey registration, admin UID configuration, INVITE_ONLY flag (off by default), optional FIRST_USER_ADMIN (off by default), and ALLOW_GUEST (on by default). Therefore an open self-host instance is NOT equivalent to the approved production signup flow with verified email, recovery, abuse prevention and privacy guarantees.
**To inspect:** email verification availability and completeness; signup/password/passkey route validation, limits, tests, session storage, HTTPS and account deletion.
**Recommendation:** disable first-user-admin and keep admin via controlled configuration; public service gate remains closed until authorization and abuse tests pass.

### Dependencies
Current package manifests show React 19, Vite 8, React Router 7, Zustand 5, Capacitor 8, Vitest 4; API uses @simplewebauthn/server, undici, web-push and optional Claude Agent SDK. No new dependency is approved for installation without checking existing components and license/performance needs.

## Risk-based priority
P0: workout data loss during offline/concurrent edit, cross-user data exposure, auth and public signup abuse, third-party exercise media licensing.
P1: adapting themes without breaking accessibility/personal accents, mobile regression, handling recommendation metadata and explainability.
P2: optional AI conversation, social engagement, visual enhancements.

## Technical work still not verified
- Build/test execution, lint and mobile packages.
- Full dependency tree and advisories, precise upstream tag alignment.
- Asset redistribution and trademark/license review.
- Functional verification of email verification/recovery and authorization.
- Actual API scale under public multiuser load, backup/restore and production deployment.
- Responsive visual testing on mobile and desktop.

## Suggested next steps
1. Map existing workout object and edit/save lifecycle.
2. Read auth routes and rate-limit protection; design missing pieces.
3. Review design tokens and component/accessibility suite to draft a minimal theme change.
4. Run baseline tests in a code execution environment *when available*; do not claim tests passed from source reading.
5. Update draft PR #1 with this documented partial baseline; keep PR draft and main untouched.
