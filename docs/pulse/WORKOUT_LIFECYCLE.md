# PULSE — Workout lifecycle and integration assessment

**Date:** 2026-10-28 | **Status:** Code reading only, partial. No tests/build run.
**Upstream baseline in fork:** `main` at `5fdb229` at time of review.

## Confirmed source paths
- `frontend/src/store/useStore.js` (~2111 lines): profile state, active session, workout history, persistence and sync orchestration.
- `frontend/src/lib/workout-model.js`: canonical row semantics, warmup phases, reps/time/cardio, dropsets and rest-pause.
- `frontend/src/lib/finish-workout.js`: pure `buildCompletedWorkout` at finish boundary, filters transient row metadata (including `planSec`, `weightOrigin`, session-specific `restSec`) and retains recorded entries.
- `frontend/src/lib/session-edit.js`: edit an already completed workout in a draft copy; save replaces record by stable/legacy ID, stamps edits for sync conflict resolution.
- `frontend/src/lib/sync-merge.js`: conflict handling and merging workout entries, timestamp/revision design.
- `frontend/src/lib/workout-controls.js`: mobile-oriented optional controls, including steppers, exercise chips, muscle map and swipe actions.

## Architectural implication
A PULSE "series completed" notification should observe **confirmed canonical set changes**, not maintain a second editable list. It must not modify transient data that the finish-workout serializer strips. Integration must preserve optional `RIR` as missing/null, distinguishing explicitly marked failure (which workout-model treats as potential RIR 0 through the effort helper) from the absence of any effort rating.

## Proposed implementation seam (not yet verified)
1. Locate the exact store action that commits/ticks a working set in the active workout.
2. Derive a compact immutable snapshot from canonical set row and session context.
3. Call pure `adviseNextSet` with snapshot; show recommendation independently from recording.
4. Track acknowledgement separately from actual load/reps; integrate with existing state and explicit merge strategy only after reviewing data model and storage.
5. On historical correction through `saveWorkoutEdit`, mark any affected advice as stale or recalculate derived read models without rewriting performed sets.
6. Preserve `buildCompletedWorkout` entry shape and upstream progression logic; any schema extension needs compatibility tests with old app clients and offline sync.

## Already-built features to keep
- Warm-up sets, dropsets, rest-pause and effort controls.
- Exercise chips, mini muscle map, swipe behavior and weight/reps steppers.
- Editable saved workouts with saved draft after interruption.
- Workout completion time based on ticked sets, avoiding erroneous multi-hour finish durations.
- Per-profile synchronization revision mechanism and offline stash.

## Tests required before first feature merge
- Logging a work set and a warm-up; optional RIR missing vs zero and failure flag.
- Reopening an interrupted active workout with pending changes.
- Editing a completed session and synchronizing between two devices.
- Dropset/rest-pause volume not double-counted.
- Unit conversion kg↔lb and per-side exercises.
- A recommendation never changes a recorded load without explicit user action.
- Recommendation stale upon edit and no ghost duplicate after 409 merge.

## Open questions to investigate from code
- Precise action entrypoints for logging/finishing sets in active session and all UI variants.
- Exact storage persistence timing and recovery consistency under app termination.
- How the Coach currently generates/accepts changes.
- Full workout record shape, test fixture inventory and interaction with `effort.js`.
- Whether supplemental advice should remain session-local or become persisted user-state with conflict stamps.

**Decision:** no new core engine module should be created until the above seams and tests are identified. No changes to functional code in this audit.
