# Project Theme Tokens Reference

## Color System (HSL Format)

### Light Mode (Default)
```css
--background: 262 25% 97%;      /* Light lavender background */
--foreground: 261 30% 10%;      /* Dark purple text */
--card: 0 0% 100%;              /* Pure white cards */
--card-foreground: 261 30% 10%; /* Dark purple text on cards */
--popover: 0 0% 100%;           /* White popovers */
--popover-foreground: 261 30% 10%;

--primary: 261 32% 64%;         /* Medium purple - main brand color */
--primary-foreground: 210 20% 98%;
--primary-soft: 262 28% 92%;    /* Light purple variant */

--secondary: 262 18% 94%;       /* Light gray-purple */
--secondary-foreground: 261 25% 15%;

--muted: 262 15% 93%;           /* Muted background */
--muted-foreground: 261 10% 44%;

--accent: 262 18% 93%;          /* Accent color */
--accent-foreground: 261 25% 15%;

--destructive: 0 84.2% 60.2%;   /* Red for error/delete */
--destructive-foreground: 210 20% 98%;

--border: 261 14% 88%;          /* Subtle border color */
--input: 261 14% 88%;           /* Input field border */
--ring: 262.1 83.3% 57.8%;      /* Focus ring color */
```

### Dark Mode (.dark class)
```css
--background: 0 0% 4%;          /* Near black background */
--foreground: 210 20% 98%;      /* Off-white text */
--card: 0 0% 9%;                /* Dark gray cards */
--card-foreground: 210 20% 98%;

--primary: 261 32% 64%;         /* Same purple (maintains brand) */
--primary-foreground: 210 20% 98%;
--primary-soft: 262 25% 24%;    /* Darker purple variant */

--secondary: 215 27.9% 16.9%;   /* Dark gray-blue */
--secondary-foreground: 210 20% 98%;

--muted: 215 27.9% 16.9%;
--muted-foreground: 217.9 10.6% 64.9%;

--accent: 215 27.9% 16.9%;
--accent-foreground: 210 20% 98%;

--destructive: 0 62.8% 30.6%;   /* Darker red */
--destructive-foreground: 210 20% 98%;

--border: 261 10% 16%;          /* Subtle dark border */
--input: 261 18% 22%;           /* Dark input field */
--ring: 263.4 70% 50.4%;        /* Focus ring dark */
```

## Chart Colors
- `--chart-1`: 261 45% 58% (Light) / 220 70% 50% (Dark)
- `--chart-2`: 173 58% 39% (Light) / 160 60% 45% (Dark)
- `--chart-3`: 290 30% 50% (Light) / 30 80% 55% (Dark)
- `--chart-4`: 43 74% 66% (Light) / 280 65% 60% (Dark)
- `--chart-5`: 330 60% 55% (Light) / 340 75% 55% (Dark)

## Spacing & Border

- **Border Radius**: `--radius: 0.5rem` (8px)
  - `lg`: `var(--radius)` = 8px
  - `md`: `calc(var(--radius) - 2px)` = 6px
  - `sm`: `calc(var(--radius) - 4px)` = 4px

- **Box Shadow**: 
  - `.card`: `0 16px 30px -26px hsl(236 38% 14% / 0.42)`

## Typography

- **Font Family**: Inter (fallback: ui-sans-serif, system-ui, sans-serif)
- **Font Weights**: Not explicitly defined; use standard React/Tailwind weights
- **Tailwind Animation**: `tailwindcss-animate` plugin enabled

## Using Tokens in Components

### Tailwind Classes (Preferred)
```jsx
// Colors
className="bg-background text-foreground"
className="bg-primary text-primary-foreground"
className="bg-card border-border"
className="text-muted-foreground"

// Border & Radius
className="border border-border rounded-lg"

// Shadow
className="shadow-card"

// Charts
className="fill-chart-1"
```

### CSS Variables (Direct Use)
```css
background-color: hsl(var(--primary));
border-color: hsl(var(--border));
color: hsl(var(--foreground));
```

## Integration Rules

1. **Never hardcode hex colors** - always use CSS variables
2. **Respect dark mode** - test both light and dark variants
3. **Use hsl(var(--token))** pattern in CSS, or Tailwind classes in JSX
4. **Maintain contrast** - ensure WCAG AA compliance (4.5:1 for text)
5. **Test responsive** - verify on mobile, tablet, desktop breakpoints
