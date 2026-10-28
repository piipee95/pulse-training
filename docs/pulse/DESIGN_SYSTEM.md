# PULSE — Mobile-first design system
Status: V0.8.1 approved **design direction**, not coded. Name and logo are provisional.

## Brand and tokens
Sport performance, precision, simplicity. No noisy gamification or unnecessary charts.
Initial palette:
- `carbon`: #11151B — dark background
- `slate`: #222A34 — dark surfaces
- `volt`: #B8F255 — dark-theme action accent, used sparingly
- `cloud`: #F5F7F9 — light background / bright text
- `steel`: #778397 — subdued information
In light mode use a **darker accessible green** for text/buttons: light lime on white fails legibility. Define semantic tokens (`background`, `surface`, `text`, `muted`, `accent`, `danger`, `focus`, `border`) per theme and verify WCAG contrast.
Typography: legible sans; use tabular numerals for kg/reps/timers. Do not add fonts/dependencies without a font-license/performance review.

## Hierarchy
1. **In workout:** current exercise, next set, last actual performance, numeric quick entry, immediate save, timer, concise recommendation.
2. **Home:** next workout and session-resume action precede statistics.
3. **Plan:** weekly and rotation plans, substitution and edit current session vs permanent template.
4. **Progress:** trends with labelled units and ranges, corrections and export.
5. **Community:** opt-in views only, never distract or expose private loads.

## Responsive
Mobile first: support 320px+ and touch use; avoid horizontal overflow and keyboard occlusion. 390–599px is the main ergonomic target. Tablet and desktop reuse architecture with reflow, not cloned screens. Desktop supports wide history, details and sidebar.
Touch targets should generally be at least 44x44 CSS pixels with sufficient separation; test smaller devices and one-handed entry.

## Shell and navigation
Mobile: Home / Plan / Train / Progress / Community bottom navigation; profile from top access. Workout mode reduces chrome and keeps save/timer in reach. Desktop: collapsible sidebar, responsive multi-column content, functional parity.
Persistent offline/sync/error status must be visible but unobtrusive. Avoid blocking every set with dialogs.

## Components to audit/reuse first
Existing upstream buttons, cards, workout tables, bottom sheets, form fields, timers, chart elements, modals, theme primitives, exercise viewer, accessibility tests and loading states.
Only add Lucide/Radix/form packages after a component-by-component gap and license audit. Never install parallel UI kits en masse.

## Interaction states and QA
Empty, loading, error, offline, pending-sync, conflicting edits, validation errors, successful set, undone set, destructive confirmation, keyboard open, large font and reduced-motion.
Acceptance: numeric entry with minimal taps, no unsaved loss, readable high-contrast modes, correct focus return after dialogs, 320px no unintended scrolling, desktop no clipped cards, accurate units and metric labels.

## Review gate
Static mockups are illustrative. Each screen requires mobile and desktop screenshot comparison, touch testing, accessibility check and regression verification against upstream workflows before implementation can be called done.
