# PULSE — Security and privacy requirements

Status: V0.9 specification; **not a security certification**. Base: approved requirements plus upstream `SECURITY.md`.

## Non-negotiable release gate
The public website and public account creation must remain disabled until all P0 controls are implemented and tested. GitHub repository visibility (public) does **not** authorize deploying public user registration.

## Identity and authentication
- Allow open signup without invitations or manual approval; require verified email before enabling production accounts. Audit available upstream passkeys, password support, recovery and session features first.
- Verify ownership server-side on every read and mutation. No client-provided user ID may override the authenticated owner.
- Use server-side rate limits for signup, recovery, authentication and potentially abusive endpoints; apply application and proxy controls, monitoring and anti-enumeration.
- Require HTTPS and appropriate secret handling; disallow debug credentials and secrets in repository.
- Provide account export, session invalidation, recovery and deletion flows, with retention and backup implications documented.

## Authorization model
Roles: user and administrator at launch; optional coach role later. Friends and groups are *relationships*, not authorization to access complete workout histories.
- Default visibility: friends can view permitted basic profile; sharing routines and activity on, loads off. Each user can change their preferences.
- Individual grant controls audience, fields and revocation; shared routine copies exclude personal history, loads and private notes.
- Admin sees operational metadata and reports, not private sports data by default.
- Blocked users cannot send requests or view audience-restricted content.

## Storage and sync
Original openGym stores per-user state as JSON with an optimistic revision/merge workflow. Audit edge cases for multi-user deployment, per-user authorization, backup and restore. Verify offline-first set saving; do not accept silent overwrite.
Protect health-related notes, measurements and progress photos as sensitive data; avoid logging contents in telemetry or audit records.
Document data retention and privacy policy before public hosting. Review Chilean and applicable privacy requirements prior to launch.

## Required test matrix
1. User A cannot read/update/delete user B's sessions, profiles, routine templates or media even by switching resource IDs.
2. Admin cannot browse private workouts without a separately justified and approved access mechanism.
3. Session theft/replay, password reset reuse, invalid verification, brute-force protection and invitation policy bypass cases.
4. Friend requests, membership revocation, share-toggle changes, block events and link-sharing expiry.
5. Offline edits, two-device concurrent changes, interrupted writes, bad backup restoration and account deletion.
6. Abuse limits, CSRF/XSS mitigations, security headers and dependency vulnerabilities.

## Operational accountability
Use admin audit trail with actor, action, target and timestamp, minimizing sensitive payloads. Define incident response, version-support policy, update cadence, rollback and restore drills. Review official upstream `SECURITY.md` before reusing its statements in a PULSE policy.
