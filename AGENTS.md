<!-- intent-skills:start -->
## Skill Loading

Before editing files for a substantial task:
- Run `pnpm dlx @tanstack/intent@latest list` from the workspace root to see available local skills.
- If a listed skill matches the task, run `pnpm dlx @tanstack/intent@latest load <package>#<skill>` before changing files.
- Use the loaded `SKILL.md` guidance while making the change.
- Monorepos: when working across packages, run the skill check from the workspace root and prefer the local skill for the package being changed.
- Multiple matches: prefer the most specific local skill for the package or concern you are changing; load additional skills only when the task spans multiple packages or concerns.
<!-- intent-skills:end -->

# TanStack Start Project

## CLI Command Used
```bash
npx @tanstack/cli@latest create my-tanstack-app --agent --package-manager pnpm --tailwind
```

## TanStack Intent Commands
- `npx @tanstack/intent@latest install` - Already run
- `npx @tanstack/intent@latest list` - Available skills listed above

## Stack
- **Framework**: React with TanStack Start
- **Styling**: Tailwind CSS v4
- **Routing**: TanStack Router
- **Package Manager**: pnpm
- **Toolchain**: Vite (default)

## Environment Variables
- No additional environment variables required for blank starter
- Standard TanStack Start uses VITE_ prefix for client-side env vars

## Setup & Run
```bash
pnpm install   # Already done
pnpm dev      # Starts dev server on port 3000
pnpm build    # Production build
pnpm preview  # Preview production build
pnpm test     # Run tests
pnpm lint     # Run ESLint
pnpm lint:fix # Fix ESLint issues
```

## Git Hooks (Husky)
- Pre-commit hook runs lint-staged (lint + tests on staged files)
- Runs automatically on `git commit`

## Next Steps
- Add routes in `src/routes/`
- Run `pnpm generate-routes` to regenerate route tree after adding routes

## Project Patterns
- See `pattern.md` for project-specific conventions, module shapes, and best practices
- Reference this file for routing, API, forms, styling, and performance patterns
- **Always generate tests when creating new components, pages, hooks, or utilities**
- Run `pnpm test` before completing any feature work
