# Fusion Angular Tailwind Starter

A production-ready Angular application template with TypeScript, TailwindCSS,  and modern tooling.

## Tech Stack

- **Frontend**: Angular 20 + TypeScript +  bootTrap + TailwindCSS
- **Styling**: TailwindCSS 3 with Typography Plugin + PostCSS + Autoprefixer
- **Testing**: Angular Testing Framework (Jasmine + Karma via `ng test`)
- **Build Tool**: Angular CLI with Vite
- **Package Manager**: npm

## Project Structure

```
src/                     # Angular application source
├── app/                 # Main application module
│   ├── app.html         # Main app template
│   ├── app.ts           # App component
│   ├── app.config.ts    # App configuration
│   ├── app.routes.ts    # Route definitions
│   └── app.spec.ts      # App component tests
├── styles.css           # Global styles with TailwindCSS imports
├── index.html           # Main HTML entry point
└── main.ts              # Application bootstrap

public/                  # Static assets
├── favicon.ico          # Site favicon
└── ...                  # Other static files
```

## Key Features

## Production Deployment

- **Standard**: `npm run build` creates optimized production build
- **Development**: `npm start` for local development
- **Testing**: `npm test` runs Angular tests with Jasmine/Karma

## Architecture Notes

- Angular 20 with standalone components
- TypeScript throughout the application
- TailwindCSS 3.4.11 for utility-first styling
- Typography plugin for rich text content
- PostCSS with Autoprefixer for cross-browser support
- Angular Testing Framework (Jasmine + Karma) for unit testing
- Angular CLI for development and build tooling

## Developer Expectations
The agent should behave like a senior developer. Before editing code, analyze the issue and identify the smallest safe change.

## Build/Test Commands
Frontend:
- npm install
- npm run build
- npm test

## Coding Rules
- Do not perform large refactors without explicit request.
- Preserve existing architecture.
- Prefer small patches.
- Explain changed files.
- Run relevant tests/build when possible.
- Never modify secrets, environment files, or production config unless explicitly requested.

## Angular Guidelines
- Use Reactive Forms.
- Check FormGroup and template binding consistency.
- Avoid direct DOM manipulation unless necessary.
- Prefer typed interfaces for API response models.


## Final Response Format
After completing a task, summarize:
1. What was changed
2. Why it was changed
3. How to test
4. Remaining risks