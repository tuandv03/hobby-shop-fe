# E-OFFICE Frontend AGENTS.md

## 1. Frontend Context

This folder contains the ECOMERGE Angular frontend, sell Yugioh card

Technology:

- TypeScript strict.
- Reactive Forms.
- Route guards.
- HTTP interceptors.
- Permission-based UI.
- bootTrap, primeNg, scss for layout

The frontend is a separate app from the backend. Do not modify backend code unless the task explicitly says to do so.
Need mapping field from BE, do not create random field name or modify BE model field name. 


## 4. Visual Design and Colors

The UI should feel like a professional office/government system: calm, formal, readable, and efficient for daily internal work.

Color rules:

- Use a restrained government/office palette. Avoid playful, marketing-heavy, neon, or overly decorative color usage.
- Primary action and active navigation color: `#1F4393`.
- Main heading and high-emphasis text: `#223548`.
- Paragraph, secondary text, and neutral icon color: `#4C5C6D`.
- Border, divider, disabled surface, and subtle background color: `#E5E9F3`.
- Prefer white or very light neutral page backgrounds with clear borders instead of heavy gradients or bright panels.
- Use color consistently for status indicators and do not invent random status colors.

Component and styling rules:

- Prefer existing Bootstrap utilities, Bootstrap layout classes, and PrimeNG components before creating custom CSS.
- Do not create new custom classes, wrappers, or component variants if Bootstrap or PrimeNG already provides an appropriate solution.
- If Bootstrap or PrimeNG default colors conflict with the E-OFFICE palette, the E-OFFICE palette wins.
- Use Bootstrap and PrimeNG for layout, utilities, component structure, and behavior; map their theme variables and severity colors to E-OFFICE design tokens.
- Keep global color overrides in the existing global stylesheet, such as `src/styles.css` or a future `src/styles.scss`, instead of scattering color overrides across feature components.
- Custom SCSS is allowed only when needed for E-OFFICE-specific branding, layout gaps not covered by Bootstrap/PrimeNG, or reusable design tokens.
- Keep custom styles small, semantic, and reusable. Avoid one-off visual classes tied to a single screen unless there is a clear reason.
- When customizing PrimeNG components, prefer theme variables, documented style hooks, or wrapper-level semantic classes instead of deep selectors.

Status colors:

| Status purpose | Background | Border |
| --- | --- | --- |
| In progress | `#FEF7EF` | `#FFDBB0` |
| Completed | `#EDFDEA` | `#BEE0B8` |
| Completed / info variant | `#D4E2FF` | `#ABBEE3` |
| Cancelled / rejected | `#FFE2EF` | `#CE5252` |
| On-time percentage / success metric | `#FFE2EF` | `#BEE0B8` |
| Break time / warning metric | `#FEF2EF` | `#FEF2EF` |
| Late percentage / risk metric | `#FFE2EF` | `#FFE2EF` |

For SCSS variables, prefer naming by semantic purpose, for example `$color-primary`, `$color-text-heading`, `$color-border`, `$status-in-progress-bg`, instead of naming by raw color.

## 5. Suggested Frontend Structure

Adapt to existing project conventions if already present.

```text
src/app/
├── core/
│   ├── auth/
│   ├── guards/
│   ├── interceptors/
│   ├── api/
│   └── layout/
├── shared/
│   ├── components/
│   ├── directives/
│   ├── pipes/
│   └── utils/
└── features/
    ├── identity/
    └── documents/
```

## 8. List/Detail State Rule

For list/detail screens, preserve list state when navigating to detail and back:

- Current page.
- Page size.
- Filters.
- Sort.
- Selected tab/status if any.
- Scroll position if practical.

Use route query params or a feature state service depending on the screen. If the user refreshes detail page directly, back behavior should fall back gracefully to the list route.

## 11. Frontend Output Report

After frontend changes, report:

```text
Files changed
Routes added/updated
Components/services/interceptors/guards added
Validation implemented
Permission UI behavior
Build/typecheck/test result
Risks or assumptions
```
