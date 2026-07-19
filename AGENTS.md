# Agent Guidelines for web-personal

## Build/Test Commands

- **Dev server**: `pnpm run dev` (starts at localhost:4321)
- **Build**: `pnpm run build` (runs `astro check` then `astro build`)
- **Preview**: `pnpm run preview`
- **Type check**: `astro check` (included in build)
- No test suite configured

## Tech Stack

- Astro 4.x + TypeScript (strict mode)
- React 19 for interactive components
- Tailwind CSS + UnoCSS for styling
- MDX for blog content
- PNPM as package manager

## Code Style

### TypeScript

- Use strict mode (`strictNullChecks: true`)
- Define interfaces for all component props and complex objects
- Use path alias `@src/*` for imports from src directory

### Imports

- Astro components: Import relative paths or from astro packages
- React components: Standard React imports with typed interfaces
- Assets: Use `@src/assets/*` path alias
- Group imports: Astro APIs, external packages, local components, types

### Components

- **Astro files**: Use `.astro` extension, frontmatter for logic, HTML-like template syntax
- **React files**: Use `.tsx` extension, functional components with TypeScript interfaces
- Follow existing naming: PascalCase for components, kebab-case for files in some areas

### Styling

- Use Tailwind utility classes with dark mode support (`dark:` prefix)
- Dark mode configured as 'selector' mode
- Consistent spacing: use Tailwind spacing scale
- Container centered with `container` class, max-width 1024px

### Error Handling

- Validate form inputs with explicit error messages
- Use try-catch blocks for async operations with user-facing error messages
- TypeScript types should prevent common errors

## Conventions

- Spanish language for UI text (form labels, messages, etc.)
- Environment variables loaded via Vite's `loadEnv`
- Site configuration in `src/consts.ts`
- Blog posts in `src/content/blog/` with frontmatter
- No inline comments unless necessary for clarity

## Landing the Plane (Session Completion)

**When ending a work session**, you MUST complete ALL steps below. Work is NOT complete until `git push` succeeds.

**MANDATORY WORKFLOW:**

1. **File issues for remaining work** - Create issues for anything that needs follow-up
2. **Run quality gates** (if code changed) - Tests, linters, builds
3. **Update issue status** - Close finished work, update in-progress items
4. **PUSH TO REMOTE** - This is MANDATORY:
   ```bash
   git pull --rebase
   bd sync
   git push
   git status  # MUST show "up to date with origin"
   ```
5. **Clean up** - Clear stashes, prune remote branches
6. **Verify** - All changes committed AND pushed
7. **Hand off** - Provide context for next session

**CRITICAL RULES:**
- Work is NOT complete until `git push` succeeds
- NEVER stop before pushing - that leaves work stranded locally
- NEVER say "ready to push when you are" - YOU must push
- If push fails, resolve and retry until it succeeds
