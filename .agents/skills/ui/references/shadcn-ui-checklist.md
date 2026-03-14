# shadcn/ui Component Integration Checklist

## Available shadcn/ui Components

### Form & Input Components
- `button` - Interactive button (primary, secondary, outline, ghost variants)
- `input` - Text input field
- `checkbox` - Checkbox input
- `radio-group` - Radio button group
- `select` - Dropdown select
- `switch` - Toggle switch
- `dialog` - Modal dialog
- `dropdown-menu` - Dropdown menu

### Display & Layout
- `card` - Card container (header, content, footer)
- `tabs` - Tab navigation
- `scroll-area` - Scrollable container
- `separator` - Visual divider
- `avatar` - User avatar display

### Feedback & Navigation
- `tooltip` - Hover tooltip
- `popover` - Popover menu

### Icon Library
- `lucide-react` - Icon library (1000+ icons)

## Installation Commands

```bash
# Single component
npx shadcn-ui@latest add button

# Multiple components
npx shadcn-ui@latest add button input dialog select

# Full list
npx shadcn-ui@latest add --all
```

## File Locations

- Installed components: `src/components/ui/`
- Component dependencies: `src/lib/utils.ts` (contains `cn()` function)

## Configuration Reference

From `components.json`:
- Style: `new-york`
- Icon Library: `radix` (Radix Icons via lucide-react)
- Base Color: `slate`
- CSS Variables: enabled
- Aliases: `@/components`, `@/utils`

## Dark Mode Support

All shadcn/ui components use CSS variables and automatically support dark mode via `.dark` class on root element.

Test checklist:
- [ ] Component renders in light mode
- [ ] Component renders in dark mode
- [ ] Text contrast meets WCAG AA (4.5:1)
- [ ] Border colors adapt to theme
- [ ] Hover/focus states visible in both modes

## Theme Customization

Modify component styles in `src/components/ui/[component-name].tsx`:
1. Update CSS variables in `src/styles/theme.css`
2. Components automatically inherit new values
3. Use Tailwind classes with token names: `bg-primary`, `text-muted-foreground`

## Accessibility Checklist

- [ ] Keyboard navigation works (Tab, Enter, Escape, Arrow keys)
- [ ] ARIA labels present: `aria-label`, `aria-describedby`
- [ ] Focus states visible (outline or ring)
- [ ] Color not only indicator of status (use icons/text too)
- [ ] Disabled state clearly visible
- [ ] Error messages associated with inputs
