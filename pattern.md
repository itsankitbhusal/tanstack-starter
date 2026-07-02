# Project Patterns

This file captures the project conventions that should guide new work. Treat it as the repo-level source of truth before adding routes, components, API hooks, or UI features.

## 1. First Checks

- Inspect the nearest existing module before editing. Match its folder shape, components, and patterns.
- Keep changes scoped to the module or shared utility needed for the task. Avoid broad refactors while adding a feature.
- Preserve API contracts and payload shapes unless the backend contract requires a minimal adapter.
- Prefer existing shared components and hooks over introducing new abstractions.

## 2. Routing and Navigation

Routes are defined in `src/routes/` using TanStack Router's file-based routing with automatic route tree generation.

- Define routes using the file convention: `src/routes/module-name.tsx` or `src/routes/module-name/index.tsx`.
- Use `createFileRoute` for filesystem-based routes (recommended).
- Use lazy imports for code splitting via `.lazy.tsx` files.
- URL hierarchy should be logical: `/module/page`.
- Create, edit, and detail/view must be separate routes.
- Use `Link` component for navigation.
- After adding/modifying routes, run `pnpm generate-routes` to regenerate `routeTree.gen.ts`.
- Add breadcrumb entries when adding new routes.
- Route types are auto-generated in `routeTree.gen.ts` - use `getRouteApi` for type-safe route access.

## 3. Module Shape

For new features:

```text
src/
  routes/
    feature-name/
      index.tsx        # List page
      create.tsx       # Create page
      $id.tsx          # Detail page
      $id.edit.tsx     # Edit page
  components/
    feature-name/
      FeatureList.tsx
      FeatureForm.tsx
      FeatureDetail.tsx
  lib/
    feature-api.ts     # API definitions
  hooks/
    use-feature.ts    # Custom hooks
```

- Keep pages focused: list pages handle table state and navigation, form pages handle validation and submission.
- Use the existing layout components from TanStack Start.

## 4. API and Data Fetching

- Use `createServerFn` for server-side API calls.
- Define typed API functions near where they're used.
- Use React Query patterns for client-side caching when needed.
- Keep query keys stable using `[featureName, params]`.

## 5. Lists and Tables

- Use TanStack Table or a table component from shadcn/ui.
- Keep table state in URL params for shareability.
- Use `useSearchParams` for URL-backed state.
- Reset to page 1 when filters change.

```tsx
const [searchParams, setSearchParams] = useSearchParams();

// Sync to URL with replace to avoid history pollution
setSearchParams({ page: '1', search: 'query' }, { replace: true });
```

## 6. Forms

- Use React Hook Form with Zod validation.
- Use shared form components from shadcn/ui (`Form`, `FormField`, `FormInput`, etc.).
- Build create defaults locally. For edit pages, fetch by id and populate form after normalization.
- Show loading state while fetching edit data.
- On submit, call the mutation and navigate back.

## 7. UI Components

- Use shadcn/ui components as the primary UI library.
- Use Tailwind CSS for styling with the project's design tokens.
- Keep components in `src/components/ui/` for shared components.
- Keep feature-specific components near the feature.

## 8. Styling

- Use Tailwind CSS utility classes.
- Access design tokens via CSS variables defined in `src/styles.css`.
- Keep operational pages compact and scannable.
- Ensure responsiveness for mobile, tablet, and desktop.

## 9. Environment Variables

- Use `VITE_` prefix for client-side environment variables.
- Access via `import.meta.env.VITE_*`.
- Do not expose secrets to the client.

## 10. Verification

- Run `pnpm build` to verify TypeScript and build.
- Run `pnpm dev` to test locally on port 3000.

## 11. Date Handling

- Use standard JavaScript `Date` APIs or a lightweight date library.
- Keep date formatting consistent across the app.
- Store dates in ISO format where possible.

## 12. TanStack Start Patterns

### Isomorphic-by-Default

All code runs on both server and client by default. Use explicit boundaries for server/client-only code.

- Use `createServerFn` for server-only logic (database, file system, secrets).
- Use `createClientOnlyFn` for client-only code (browser APIs, localStorage).
- Use `ClientOnly` component for client-only UI (maps, charts, third-party widgets).
- Import server functions from `@tanstack/react-start`.

```tsx
import { createServerFn, createClientOnlyFn } from '@tanstack/react-start'

// Server-only function
const getSecretData = createServerFn({ method: 'GET' }).handler(async () => {
  return await db.query('SELECT * FROM secrets')
})

// Client-only function  
const getBrowserLocation = createClientOnlyFn(() => {
  return new Promise((resolve) => navigator.geolocation.getCurrentPosition(resolve))
})
```

### Server Functions

- Use Zod validators for input validation.
- Throw `redirect()` for navigation, `notFound()` for 404s.
- Handle errors with try/catch and return typed error responses.
- Use FormData via `request.formData()`.

```tsx
const updateUser = createServerFn({ method: 'POST' })
  .validator(z.object({
    id: z.string(),
    name: z.string().min(1),
  }))
  .handler(async ({ data }) => {
    await db.user.update({ where: { id: data.id }, data: { name: data.name } })
    return { success: true }
  })
```

### Type Safety

- Never cast or annotate inferred types - let TypeScript infer.
- Use `getRouteApi` for type-safe route access in code-split files.
- Keep route types in `routeTree.gen.ts` - don't manually type routes.

```tsx
import { getRouteApi } from '@tanstack/react-router'

const Route = getRouteApi('/users/$userId')
const userId = Route.useParams({ from: '/users/$userId' }).userId
```

## 13. Performance

### Bundle Optimization (CRITICAL)

- Import directly from component libraries - avoid barrel files (index exports).
- Use `.lazy.tsx` files for code splitting heavy routes.
- Lazy-load heavy components with dynamic imports.
- Use `preload` on Link for perceived speed.

```tsx
// Instead of: import { Button, Input } from 'some-ui-lib'
// Use direct imports:
import Button from 'some-ui-lib/Button'
import Input from 'some-ui-lib/Input'

// Lazy load heavy routes
const HeavyPage = () => import('./HeavyPage')
```

### Data Fetching

- Use `Promise.all()` for independent parallel requests.
- Avoid sequential await chains - start promises early, await late.
- Use React Query or SWR for client-side caching and deduplication.
- Implement proper query key structures.

```tsx
// Bad: sequential (slow)
const user = await fetchUser()
const posts = await fetchPosts(user.id)

// Good: parallel (fast)
const [user, posts] = await Promise.all([
  fetchUser(),
  fetchUserPosts(userId),
])
```

### Rendering Performance

- Derive state during render, not in useEffect.
- Don't define components inside components - creates new type on every render.
- Use `useMemo` for expensive computations.
- Use `useCallback` for stable callback references.
- Use `startTransition` for non-urgent updates.

```tsx
// Bad: defines component inside component
function Parent() {
  const Child = () => <div>...</div>  // BAD: new type every render
  return <Child />
}

// Good: define outside
function Child() { return <div>...</div> }
function Parent() {
  return <Child />
}
```

## 14. New Feature Checklist

- Add routes in `src/routes/` using `createFileRoute`.
- Run `pnpm generate-routes` to regenerate the route tree.
- Add API functions using `createServerFn` from `@tanstack/react-start`.
- Add pages with proper form validation using React Hook Form + Zod.
- Add shared components to `src/components/`.
- Run `pnpm build` to verify.
