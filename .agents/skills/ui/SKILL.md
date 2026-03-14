---
name: ui
description: This skill guides component selection and integration from shadcn/ui (accessible primitives, forms, dialogs, menus) and Aceternity UI (advanced visual sections, effects, motion patterns). Use when building UI components, designing layouts, styling pages, or implementing design patterns. Includes theme token mapping for light/dark mode support, responsive behavior, and accessibility best practices.
---

# UI Component Selection & Integration

## Purpose
Guide component selection and implementation from shadcn/ui and Aceternity UI with proper theme token adaptation, ensuring visual consistency, accessibility, and responsive design.

## Component Source Priority

### shadcn/ui (Accessible Primitives)
Use for: Forms, inputs, buttons, dialogs, dropdowns, menus, tabs, tooltips, data display, and standard interactive components.
- Registry: https://ui.shadcn.com/
- Installation: `npx shadcn-ui@latest add <component-name>`
- Already configured in `components.json`

### Aceternity UI (Advanced Visual Patterns)
Use for: Hero sections, carousels, animated backgrounds, spotlight effects, motion patterns, and advanced visual sections.
- Registry: https://ui.aceternity.com/
- Manual integration via copy-paste or registry approach

## Project Theme Tokens

### Color Tokens (HSL format)
- **Light Mode** (`--root`):
  - `--background`: 262 25% 97% (light lavender)
  - `--foreground`: 261 30% 10% (dark purple)
  - `--primary`: 261 32% 64% (medium purple)
  - `--primary-foreground`: 210 20% 98% (off-white)
  - `--secondary`: 262 18% 94% (light gray-purple)
  - `--muted`: 262 15% 93% (very light gray)
  - `--border`: 261 14% 88% (subtle gray)

- **Dark Mode** (`.dark`):
  - `--background`: 0 0% 4% (near black)
  - `--foreground`: 210 20% 98% (off-white)
  - `--primary`: 261 32% 64% (medium purple)
  - `--card`: 0 0% 9% (dark gray)

### Border & Spacing
- `--radius`: 0.5rem (8px)
- `boxShadow.card`: 0 16px 30px -26px hsl(236 38% 14% / 0.42)

### Typography
- Font family: Inter (configured in tailwind.config.js)

## Integration Checklist

**Before Copying Components:**
1. Search component in shadcn/ui first; if unavailable, check Aceternity UI
2. Review dark mode tokens in source documentation
3. Confirm responsive breakpoints

**During Integration:**
1. Replace hardcoded hex colors with CSS variable references (`hsl(var(--primary))`)
2. Use Tailwind token classes: `bg-primary`, `text-foreground`, `border-border`
3. Preserve ARIA labels, focus states, and keyboard navigation
4. Test responsive behavior (mobile, tablet, desktop)

**After Integration:**
1. Verify light/dark mode toggle works
2. Test keyboard navigation (Tab, Enter, Escape)
3. Confirm visual consistency with existing dashboard surfaces
4. Check shadow and spacing align with design tokens

## Implementation Notes

- Store reusable components in `src/components/ui/` (shadcn/ui)
- Store advanced sections in `src/components/` subdirectories by feature
- Always use existing utility functions from `src/lib/utils.ts` for className merging
- Reference Tailwind config in `tailwind.config.js` for extend colors
- Icon library: Radix Icons (via `lucide-react` package)
