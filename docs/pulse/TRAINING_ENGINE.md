# PULSE — Training recommendation engine contract
Status: V0.5 approved functional concept; V0.9 technical proposal, **not implemented**.

## Scope
A pure, deterministic decision function augments openGym's existing progression, not a conflicting replacement. User approval is mandatory before modifying a proposed load or routine. AI may explain, not silently write training facts.

## Data separation
- Plan: planned routine/session/exercise, range, sets, target RIR and rest.
- Actual: completed set ID, exercise ID, timestamp, unit, load, reps, optional RIR/RPE, notes and quality flags.
- Derived: estimated strength, volume and fatigue proxies with method and confidence.
- Advice: recommendation ID, rule version, input IDs, reason, proposed action, user response and timestamp.
Missing RIR is `null`, NEVER 0. Keep exercise variants and machine-specific increments distinct.

## Proposed deterministic API (subject to existing state schema audit)
```ts
type Action = 'hold'|'consider_increase'|'consider_reduce'|'rest_more'|'review_technique'|'stop_exercise'|'insufficient_data';
type Recommendation = {
  id: string; action: Action; ruleVersion: string;
  reasonCodes: string[]; explanation: string;
  inputSetIds: string[]; proposedLoad?: number;
  requiresConfirmation: true;
};
function adviseNextSet(context: Readonly<WorkoutContext>): Recommendation;
```
This is a contract example, not code committed to the application.

## Safety and logic ordering
1. Unexpected pain or red-flag report: stop current exercise; do not offer load increase or diagnosis.
2. Deficient technique: suggest technique review and optional reduction, not progression.
3. Missing comparable history: explain limits; do not invent a precise target.
4. In-range reps with target RIR: generally hold, guided by prior sets and rest.
5. Top-of-range across required sets/sessions and technique acceptable: consider a compatible minimal equipment increment.
6. Below-range or failure with fatigue: review rest/load and previous performance; no blind automatic deload.
7. Record decision as advice only, separate from actual completed set.

## In-session and across-session progression
Re-evaluate on confirmed set saves and when user edits a previous set; maintain event provenance and ensure no stale recommendation is applied. Across-session progression considers exercise equivalence, set volume, full range, RIR where available and load increment options. No progression from a single exceptional set alone.

## Integration and quality gates
Audit upstream `frontend/src/lib/` progression helpers, fitness calculations and the optional AI Coach. Prefer adapter tests and parity with native progression.
Test at minimum: missing RIR; RIR=0; pain override; poor technique; top range one set vs all sets; limited equipment increments; offline revision conflict; correcting old set; multiple devices and repeated save; different unit systems; no history. Rule versions must be retained for audit.
Recommendations are optional and can be disabled; quick logging continues without them.
