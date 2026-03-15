# Workspace File Structure Summary

## Root
- AGENTS.md
- components.json
- dist/
- eslint.config.js
- index.html
- node_modules/
- package-lock.json
- package.json
- postcss.config.js
- public/
- README.md
- SKILL.md
- tailwind.config.js
- temp_mock.ts
- tsconfig.app.json
- tsconfig.json
- tsconfig.node.json
- vercel.json
- vite.config.ts

## src/
- App.tsx
- index.css
- main.tsx

### src/app/
- context/
  - dashboard-ui-context.tsx
- export/
  - export-resolver.ts
- layout/
  - dashboard-layout.tsx
- pages/
  - ai-monitor-page.tsx
  - finance-page.tsx
  - login-page.tsx
  - notifications-page.tsx
  - overview-page.tsx
  - settings-page.tsx
  - user-management-page.tsx
- routes/
  - dashboard-routes.ts

### src/components/
- charts/ (empty)
- dashboard/
  - dashboard-command-center.tsx
  - floating-dock-nav.tsx
  - top-right-controls.tsx
  - ui/
- ui/
  - animate-tabs.tsx
  - avatar.tsx
  - background-beams.tsx
  - badge.tsx
  - bento-grid.tsx
  - button.tsx
  - card.tsx
  - chart.tsx
  - checkbox.tsx
  - command.tsx
  - dialog.tsx
  - dropdown-menu.tsx
  - floating-dock.tsx
  - floating-dock.tsx.bak
  - input.tsx
  - notification-list.tsx
  - radio-group.tsx
  - scroll-area.tsx
  - select.tsx
  - separator.tsx
  - sheet.tsx
  - skeleton.tsx
  - slide.tsx
  - switch.tsx
  - table.tsx
  - tabs.tsx
  - text-generate-effect.tsx
  - textarea.tsx
  - tooltip.tsx

### src/lib/
- exporters.ts
- formatters.ts
- utils.ts

### src/mocks/
- admin-profile.mock.ts
- dashboard-features.mock.ts
- dashboard-insights.mock.ts

### src/styles/
- theme.css

### src/types/
- admin-profile.ts
