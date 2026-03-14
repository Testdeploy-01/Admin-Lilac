# Aceternity UI Advanced Patterns

## When to Use Aceternity Components

Use Aceternity UI for:
- Hero sections with animated backgrounds
- Carousel/slider components with motion effects
- Spotlight or highlight effects
- Advanced motion patterns and transitions
- Complex visual sections that need animation
- Parallax effects
- Animated cards and containers

## Common Aceternity UI Patterns

### 1. Hero Section with Animated Background
- Animated gradient or moving particles background
- Title and CTA button overlay
- Responsive container
- Typical usage: Landing pages, feature introductions

### 2. Animated Carousel
- Auto-rotating carousel with smooth transitions
- Navigation buttons and indicators
- Supports keyboard navigation
- Typical usage: Portfolio showcase, testimonials, feature highlights

### 3. Spotlight Effect
- Dynamic light/hover effect following cursor or fixed
- Text overlay with enhanced visibility
- Typical usage: Feature highlights, premium sections

### 4. Animated Cards
- Cards with entrance/hover animations
- Staggered animation when loading
- Typical usage: Feature lists, team members, product gallery

### 5. Parallax Sections
- Multi-layer scrolling effect
- Depth perception through different scroll speeds
- Typical usage: About pages, storytelling sections

## Integration Approach

### Option 1: Copy-Paste Method (Recommended)
1. Find component on https://ui.aceternity.com/
2. Copy component code
3. Paste into new file in `src/components/`
4. Replace hardcoded colors with CSS variables
5. Test responsive and dark mode

### Option 2: Registry Method
- Use `components.json` registry: `"@aceternity": "https://ui.aceternity.com/registry/{name}.json"`
- Install via CLI if available

## Customization for Project Theme

### Color Replacement Guide

| Original | Project Equivalent |
|----------|-------------------|
| `#2563eb` (blue) | `hsl(var(--primary))` |
| `#64748b` (gray) | `hsl(var(--muted-foreground))` |
| `#1e293b` (dark) | `hsl(var(--foreground))` |
| `#f1f5f9` (light) | `hsl(var(--background))` |

### Motion Library

Aceternity components often use the `motion` library (already in dependencies):
```bash
npm list motion
# Shows: motion@12.35.0
```

### Common Animation Utilities

```jsx
import { motion } from 'motion/react';

// Fade in on scroll
<motion.div
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
/>

// Hover scale effect
<motion.div
  whileHover={{ scale: 1.05 }}
  className="cursor-pointer"
/>
```

## Template Structure

Typical Aceternity component structure:
```jsx
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

export function ComponentName({ className, ...props }) {
  return (
    <motion.div
      className={cn('relative', className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      {...props}
    >
      {/* Content */}
    </motion.div>
  );
}
```

## Testing Aceternity Components

Checklist after integration:
- [ ] Animation smooth on 60fps
- [ ] Responsive on mobile (animations may need adjustments)
- [ ] Dark mode colors applied
- [ ] No hardcoded hex colors remain
- [ ] Performance: no memory leaks, smooth scrolling
- [ ] Accessibility: can skip animations, keyboard accessible
- [ ] Fallback for reduced-motion preference

## Reduce Motion Accessibility

```jsx
// Respect user's motion preferences
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

<motion.div
  animate={prefersReducedMotion ? {} : { opacity: 1 }}
  transition={{ duration: prefersReducedMotion ? 0 : 0.5 }}
/>
```
