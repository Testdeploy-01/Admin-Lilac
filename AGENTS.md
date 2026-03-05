# UI Agent Rules

## Component Sources (Design/UI Tasks)
- For any task related to UI design, layout, component building, or page styling, use components/patterns from these sources only:
  - https://ui.aceternity.com/
  - https://ui.shadcn.com/
- Source priority:
  1. `shadcn/ui` for accessible primitives, forms, dialogs, menus, and data display.
  2. `Aceternity UI` for advanced visual sections, effects, and motion patterns.
- If a required component does not exist in these two sources, ask the user before using any other source.

## Theme-Matching Requirement
- Always adapt imported components to the current project theme and design tokens.
- Do not ship raw copied styles directly from source docs.
- Match:
  - existing color tokens (`--background`, `--foreground`, `--primary`, `--muted`, `--border`, etc.)
  - existing radius, spacing scale, and typography rhythm
  - existing light/dark mode behavior
- Prefer token-based classes and CSS variables over hardcoded hex colors.

## Integration Quality Rules
- Keep responsive behavior for mobile and desktop.
- Keep accessibility states (focus, hover, disabled, aria labels).
- Keep visual consistency with existing dashboard surfaces (`card`, `border`, `shadow`, spacing).
- In implementation summaries, mention which parts came from `Aceternity` and which from `shadcn/ui`.

