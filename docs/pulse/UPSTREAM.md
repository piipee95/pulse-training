# PULSE — Upstream, licenses and dependency maintenance
Status: documented policy; compliance audit remains pending.

## Origin
PULSE is a derivative fork of [DuarteSantos8/openGym](https://github.com/DuarteSantos8/openGym), hosted at [piipee95/pulse-training](https://github.com/piipee95/pulse-training). The source code advertises AGPL-3.0-or-later in package manifests; repository GitHub metadata displays AGPL-3.0. Keep the original `LICENSE`, `NOTICE.md`, author attributions and notices intact. Consult the full applicable license before distribution and network deployment.

## Distinguish code from media
The exercise catalogue and accompanying images/animations may have different copyright/license permissions. Inventory assets, origin, derivatives, terms, and permitted redistribution before shipping branded builds. No assumption that AGPL automatically covers every bundled media asset.

## Fork synchronization procedure
1. Record current PULSE branch SHA, upstream main SHA and latest tag. Back up before merges.
2. Review upstream security advisories, changelog, API/state changes, build tools and mobile packaging modifications.
3. Merge/update upstream only on a dedicated branch; resolve conflicts intentionally; never overwrite PULSE data schemas blindly.
4. Run source tests, sync parity, mobile build, API tests, authentication and PULSE-specific regression tests.
5. Open PR with compatibility matrix, risk notes and evidence. Merge to PULSE main only after review.
6. Update version/compatibility documentation; do not claim PULSE release is the same as upstream tag.

## Dependency policy
Baseline frontend observed: React 19, Vite 8, React Router 7, Zustand 5, Capacitor 8, Vitest 4. Baseline API: Node `node:http`, `@simplewebauthn/server`, `web-push`, `undici`; optional Claude Agent SDK. All are existing, not proposed installs.
Avoid replacing React, state storage, auth, charting or CSS without written design rationale and measurable benefit. New packages require license, maintenance, accessibility, bundle size and security checks.

## Known integration sensitivities
Upstream documents mirrored logic and parity tests between `frontend/src/lib/sync-merge.js` and `api/sync-stamps.js`, and other copied helpers. Update both sides in the same change if the contract shifts. Keep offline mobile state and online syncing equivalent. Coach and MCP are already present: assess actual access/control and do not describe them as absent.

## Required audit evidence before first feature PR
- Source SHA/tag and dependency lockfiles.
- Inventory of copyrighted imagery/animations and redistribution decisions.
- Test commands and captured results, mobile and API build result.
- State model map for workout sets, recommendations, users and group consents.
- Secure production source distribution and AGPL compliance checklist.
