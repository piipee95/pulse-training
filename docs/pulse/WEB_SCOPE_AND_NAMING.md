# PULSE — Product naming and platform decision

**Decision date:** 2026-10-28 | **Status:** approved platform scope; provisional product name.

## Platform scope
- **Current deliverable: responsive WEB APPLICATION**, mobile-first, with desktop support.
- Prefer existing openGym browser/PWA/offline capabilities, after validating their current behavior.
- **No Android/iOS packaging, store publication, native submission, or store accounts in the current roadmap.** Preserve existing Capacitor files and compatibility; do not prioritize native-specific development.
- Web deployment is blocked until production security/privacy, license and data integrity gates pass.
- No paid tools or APIs as project requirements.

## Naming
- Primary provisional product name: **PULSE Train**.
- Short brand in UI: **PULSE**.
- Repository remains `piipee95/pulse-training` (no repository rename needed).
- The alternative `PULSE Gym` is not adopted: existing apps with that name were observed on Google Play and App Store in a preliminary public search. The uniqueness/legal availability of PULSE Train is **not verified**.
- Do not migrate application bundle IDs, domains, logo licensing or legal trademark declarations until name clearance.

## Engineering consequence
V1 focuses on mobile-first **web** navigation, training screen, theme, one-handed set input, browser offline recovery, keyboard ergonomics and responsive desktop layouts. Original native integrations remain unmodified. Subsequent phase may revisit native packaging if independently authorized.

## Source note
Preliminary name search: Google Play 'Pulse Gym' (com.fitgymsoftware.pulsegym), Apple App Store 'PULSE GYM' (id1535894065). These are existence signals, not legal conclusions.
