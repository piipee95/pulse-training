# PULSE Train — Delivery roadmap and gates
Status: planned; V0.1–V0.8.1 functionally approved; dates and estimates deliberately not promised.

## Foundation / V0.9
- [x] Fork and named documentation branch.
- [x] Master specification, architecture, visual system, training engine contract.
- [x] Draft security, roadmap and upstream maintenance notes.
- [ ] Record source HEAD, upstream tag and exact dependency lockfile snapshot.
- [ ] Review license/third-party media rights, tests, CI, mobile and server baseline.
- [ ] Verify documents and submit documentation-only PR for review.
**Done when:** requirements traceable, risks classified, no app code modified, documentation PR reviewed.

## V1 — Mobile-first responsive web core
- [ ] Review and adapt existing component tokens and layout; dark and light themes.
- [ ] One-handed set logging, pre-filled previous set, timer, offline recovery.
- [ ] Verify 320px through desktop layouts, keyboard and accessibility.
**Done when:** full workout saved/resumed offline; upstream parity checks and visual QA pass.

## V2 — Assisted training
- [ ] Integrate pure rules with existing progression, no double calculation.
- [ ] Capture optional RIR, technique and notes; explain and track every recommendation.
- [ ] Evaluate corrections, progression history and user approval.
**Done when:** deterministic unit tests and regression scenarios pass.

## V3 — Public accounts and operations
- [ ] Audit and extend authentication; verified email, safe recovery and abuse controls.
- [ ] Isolate each user's records and profiles; add admin moderation/audit.
- [ ] Backup/restore drills, HTTPS, privacy information and threat model.
**Public deployment forbidden until P0 tests pass.**

## V4 — Community
- [ ] Friends, blocking, groups and granular consents.
- [ ] Safe copy/share routines without personal loads, optional activity feed.
- [ ] Authorization and privacy revocation tests.

## V5 — Web production release
- [ ] Platform/device QA, compatibility and performance.
- [ ] Source/media license compliance, notices and source availability.
- [ ] CI, deployment and rollback verification.
- [ ] Operational monitoring, backups and incident procedures.
**Done when:** signed-off evidence supports release. Work stages may be reorganized for dependencies but cannot bypass release gates.

## Rules for PRs
One cohesive objective per branch; cite requirement IDs and record tests, screenshots and risks. Prefer simple diffs over architectural rewrites. No third-party or paid services without rationale. Record status as specified, implemented, tested or deployed separately.
