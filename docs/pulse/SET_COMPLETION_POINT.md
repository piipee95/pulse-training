# PULSE — Confirmed set completion integration point

Date: 2026-10-28. Source review only; no tests run or application code changed.

## Exact UI entrypoint
`frontend/src/views/Workout.jsx`, around line 1776: `toggle(idx, i, side, { quiet, onFocusProgress })`.

- Resolves exercise mode via `modeAt(idx)`.
- Calls the existing Zustand `update(s => { ... }, true)`.
- For bilateral/unilateral sets, calls `toggleSide` and recalculates row completion; ordinary sets flip `e.sets[i].done`.
- Records `at = Date.now()` on confirmed ticks outside the history editor.
- Updates completed-exercise indicators and invokes end-of-workout flow.
- Runs side effects such as haptics, timers, navigation and completion sheet after commit.
- History edit mode returns before new-session completion side effects.
- Documentation in this file also mentions Apple Watch tracking through the same toggle flow.

## Persisting data
`frontend/src/store/useStore.js` provides `update(mut, push=true)`, which drafts immutable state, stamps edits, then calls `persist(S, push)`. `saveNow()` persists the mobile mirror. A confirmed tick passes `push=true` through this canonical path, avoiding an independent PULSE record stream.

## Integration decision
**Do not install a parallel PULSE logging store.** Build a pure recommendation adapter from the post-update canonical snapshot and display advice only for a new confirmed work-set tick. Avoid triggering from unticks, history editing, warm-up-only events, or updates to UI that are not confirmed set completion. Handle one-sided sets and delayed completion explicitly.

### Implementation nuance
`toggle` is defined in a view and is not necessarily the only input path: watch and time hold flows can reuse it; review every callback and any store-level programmatic logging before treating it as global event source. Favor one testable post-commit dispatcher once the complete event map is audited.

### Additional safety
- Re-check whether a recommendation is stale after user edits sets/weights.
- Never write a proposed load to `S.active` without explicit confirmation.
- Do not treat null effort as 0.
- Ensure no duplicate advice when the same set is retried from watch, native or browser.
- Do not add fields to `S` until `sync-merge.js`, serializers and unit conversion are updated/tested for compatibility.

## Next verification
Inspect lines ~1815–1955 of Workout.jsx and associated `watch-sync.js` and `sheets.jsx` finalization. Draft deterministic test cases. Run existing Vitest/API suite when execution environment is available. No functional changes are warranted yet.
