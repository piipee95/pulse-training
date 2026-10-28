# PULSE — Set completion paths and test matrix

Date: 2026-10-28. Partial code inspection, not executable validation.
Baseline fork: piipee95/pulse-training.

## Observed completion paths
1. **Touch checkbox / done:** `frontend/src/views/Workout.jsx` passes `onToggle` and `onToggleSide` to `toggle(idx,i,side,...)`. `toggle` flips done, persists through `useStore.update`, and may trigger rest, progression and completion UI.
2. **Effort picker:** same view, `pickEffort`, and unilateral side effort picker can auto-confirm previously incomplete sets on selection. Clearing effort does not auto-complete.
3. **Timed hold:** `holdDone` routes the completed hold to `toggle`, with quiet notification when chime already played.
4. **Apple Watch:** `bindWatchActions(setDone)` around lines 1914+, writes measured fields first, then `toggleRef.current` only when not already done; later watch events may fill timestamp and heart rate. Last-writer sequencing means recommendations must not be duplicated or read intermediate stale values.
5. **Live Activity / lock screen:** source comments indicate same toggle path; inspect implementation in detail before committing to single entrypoint.
6. **Historical backfill:** `markAllDone` uses `markAllSetsDone` and `update` for previously completed work. This is NOT a new live completion event.
7. **History edit:** distinct workflow in `session-edit.js`; no live advice events should be created simply by correcting prior records.

## Non-negotiable event semantics
- A recommendation fires only after a newly confirmed **working** set, not a warmup, duplicate watch replay, untick or historical backfill.
- A unilateral set requires clear policy: either after each side if helpful, or once full row complete; proposal: once both sides complete by default.
- Watch-set timestamp and effort may arrive in follow-up mutations; advisor should consume finalized post-write state, not react to an intermediate update.
- Session ending is distinct from per-set completion; guard against recommendation UI appearing under finish sheet.
- Advice should be recomputable or marked stale when stored record changes. Separate immutable performed facts from suggestions/approvals.

## Test matrix (design, not run)
| ID | Scenario | Expected |
| --- | --- | --- |
| SET-01 | Touch completes normal work set | One advice event, correct weight/reps |
| SET-02 | Toggle done back to incomplete | No new advice, previous advice stale |
| SET-03 | RIR picker auto-completes | One advice event, rated RIR, no double trigger |
| SET-04 | Clear effort on incomplete row | No completion advice |
| SET-05 | Unilateral left then right | At most one full-row advice by default |
| SET-06 | Timer finishes hold | One event, duration preserved |
| SET-07 | Watch replays completed set | No duplicate, last valid timestamp/data |
| SET-08 | Watch supplies RIR after set | Advice consistency or recompute rule |
| SET-09 | Lock screen completes set | Same behavior as touch |
| SET-10 | Historical mark-all-done | No new-live advice |
| SET-11 | History edit | Old derived recommendations invalidated/updated |
| SET-12 | Warmup or cardio | No inappropriate strength load advice |
| SET-13 | Offline save & reopen | No lost set; at most one advice after sync |
| SET-14 | Two-device 409 merge | No duplicated or lost completed events |
| SET-15 | Pain flag / poor technique | Safety override before load suggestion |
| SET-16 | Unrated RIR vs RIR 0/failure | Missing stays unknown; real zero recognized |
| SET-17 | kg/lb switch | No mixed units, equivalent recommendations |
| SET-18 | Cancel/discard session | No phantom completed workout |

## Proposed implementation design
Before writing an observer: map view action calls through store and watch/lock screen; choose canonical post-commit transition detection (previous vs next confirmed set status with stable session/exercise/set identifiers), guard session ownership, and persist advice only after state migration/merge rules are reviewed. Use pure rule engine first and feature flag it off by default until validated.

**Status:** code path map partially confirmed; no build or tests executed, no app code changed.
