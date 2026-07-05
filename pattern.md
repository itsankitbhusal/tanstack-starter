# Project Patterns

This file captures the project conventions that should guide new work. Treat it as the repo-level source of truth before adding routes, components, API hooks, or UI features.

## 1. First Checks

- Inspect the nearest existing module before editing. Match its folder shape, components, and patterns.
- Keep changes scoped to the module or shared utility needed for the task. Avoid broad refactors while adding a feature.
- Preserve API contracts and payload shapes unless the backend contract requires a minimal adapter.
- Prefer existing shared components and hooks over introducing new abstractions.
- **State Management**: Use **Zustand** for global client state. Use URL/search params for server state.

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

## 3. Component Folder Structure

All components, hooks, and utilities MUST be in their own folder with co-located tests.

> **Exception**: shadcn/ui components are kept in `src/components/ui/` as-is (they follow shadcn conventions).

### Folder Structure with Barrel Exports

Use `@/` absolute path imports (configured via tsconfigPaths):

```
src/
  components/
    feature-name/
      index.ts              # Barrel export
      ComponentName.tsx     # Main component
      ComponentName.test.tsx # REQUIRED: Co-located test
      sub-component.tsx
  hooks/
    use-feature/
      index.ts              # Barrel export
      use-feature.ts       # Hook implementation
      use-feature.test.ts  # REQUIRED: Co-located test
  lib/
    utils.ts               # Shared utilities
    utils.test.ts          # REQUIRED: Co-located test
  config/
    branding.ts           # Configuration
```

### Component Structure Rules

1. **Every component in its own folder** - No loose files in component directories
2. **Co-located tests** - Test files next to the component/hook they test
3. **Barrel exports** - Use `index.ts` for clean imports
4. **Naming** - PascalCase for components, camelCase for hooks

```typescript
// Instead of: src/components/Button.tsx
// Use: src/components/button/Button.tsx

// Good structure:
src/components/button/
├── index.ts          # export { Button } from './Button'
├── Button.tsx        # Component implementation
└── Button.test.tsx  # Co-located test (REQUIRED)

// Good structure for hooks:
src/hooks/use-toggle/
├── index.ts         # export { useToggle } from './use-toggle'
├── use-toggle.ts    # Hook implementation
└── use-toggle.test.ts # Co-located test (REQUIRED)
```

- Keep pages focused: list pages handle table state and navigation, form pages handle validation and submission.
- Use the existing layout components from TanStack Start.

## 4. API and Data Fetching

- Use `createServerFn` for server-side API calls.
- Define typed API functions near where they're used.
- Use React Query patterns for client-side caching when needed.
- Keep query keys stable using `[featureName, params]`.

## 5. State Management

This project uses **Zustand** for global client-side state.

### When to Use Zustand

- **Global UI state**: theme, sidebar open/close, modals
- **User session**: auth token, user profile
- **Client-side cache**: data not on server (preferences, drafts)
- **Complex local state**: multi-step forms, complex interactions

### When NOT to Use Zustand

- Server data → use `createServerFn` + React Query
- URL state → use search params
- Form state → use React Hook Form

### Zustand Pattern

```typescript
// src/stores/user-store.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UserState {
  user: User | null
  token: string | null
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  logout: () => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      logout: () => set({ user: null, token: null }),
    }),
    { name: 'user-storage' }
  )
)
```

### Store Organization

```
src/
  stores/
    user-store.ts      # Auth/user state
    ui-store.ts        # UI state (theme, sidebar)
    index.ts           # Barrel export
```

### Testing Zustand

```typescript
// user-store.test.ts
import { useUserStore } from './user-store'

describe('useUserStore', () => {
  beforeEach(() => {
    useUserStore.getState().logout() // Reset before each test
  })

  it('should set user', () => {
    const user = { id: '1', name: 'John' }
    useUserStore.getState().setUser(user)
    expect(useUserStore.getState().user).toEqual(user)
  })

  it('should logout', () => {
    useUserStore.getState().setUser({ id: '1', name: 'John' })
    useUserStore.getState().logout()
    expect(useUserStore.getState().user).toBeNull()
  })
})
```

## 6. Lists and Tables

- Use TanStack Table or a table component from shadcn/ui.
- Keep table state in URL params for shareability.
- Use `useSearchParams` for URL-backed state.
- Reset to page 1 when filters change.

```tsx
const [searchParams, setSearchParams] = useSearchParams();

// Sync to URL with replace to avoid history pollution
setSearchParams({ page: '1', search: 'query' }, { replace: true });
```

## 7. Forms

- Use React Hook Form with Zod validation.
- Use shared form components from shadcn/ui (`Form`, `FormField`, `FormInput`, etc.).
- Build create defaults locally. For edit pages, fetch by id and populate form after normalization.
- Show loading state while fetching edit data.
- On submit, call the mutation and navigate back.

## 8. UI Components

- Use shadcn/ui components as the primary UI library.
- Use Tailwind CSS for styling with the project's design tokens.
- Keep components in `src/components/ui/` for shared components.
- Keep feature-specific components near the feature.

## 9. Styling

- Use Tailwind CSS utility classes.
- Access design tokens via CSS variables defined in `src/styles.css`.
- Keep operational pages compact and scannable.
- Ensure responsiveness for mobile, tablet, and desktop.

## 10. Environment Variables

- Use `VITE_` prefix for client-side environment variables.
- Access via `import.meta.env.VITE_*`.
- Do not expose secrets to the client.

## 11. Verification

- Run `pnpm build` to verify TypeScript and build.
- Run `pnpm dev` to test locally on port 3000.

## 12. Date Handling

- Use standard JavaScript `Date` APIs or a lightweight date library.
- Keep date formatting consistent across the app.
- Store dates in ISO format where possible.

## 13. TanStack Start Patterns

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

## 14. Performance

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

## 15. Testing (MANDATORY)

This project uses **Vitest** with **React Testing Library**.

### MANDATORY TEST RULES

**Every new component, hook, utility, and function MUST have a co-located test file.**

- Components → `ComponentName.test.tsx`
- Hooks → `useHookName.test.ts`
- Utilities → `utils.test.ts`
- Functions → `functionName.test.ts`

No exceptions. Tests are NOT optional.

### Test File Organization

```
src/
  components/
    button/
      index.ts              # Barrel export
      Button.tsx           # Component
      Button.test.tsx     # REQUIRED
    app-footer/
      index.ts
      AppFooter.tsx
      AppFooter.test.tsx # REQUIRED
  hooks/
    use-toggle/
      index.ts
      use-toggle.ts
      use-toggle.test.ts  # REQUIRED
  lib/
    utils/
      index.ts
      utils.ts
      utils.test.ts      # REQUIRED
```

### Test Naming Conventions
- `*.test.ts` - Unit tests for utilities/hooks
- `*.test.tsx` - Component tests
- `*.integration.test.ts` - Integration tests
- `*.e2e.test.ts` - End-to-end tests (separate folder)

### Test Categories
```typescript
describe('Unit', () => {
  // Pure function tests - fast, no mocks
})

describe('Integration', () => {
  // Multiple units working together - moderate speed
})

describe('Component', () => {
  // User interactions - uses Testing Library
})
```

### Running Tests
```bash
pnpm test              # Run all tests
pnpm test:watch       # Watch mode for development
pnpm test:unit        # Run only unit tests
pnpm test:components # Run only component tests
pnpm test:coverage   # With coverage report
```

5. **Coverage Targets for Large Projects**
- **Utilities/Hooks**: 90%+ coverage
- **Shared Components**: 80%+ coverage  
- **Feature Components**: 70%+ coverage
- **Critical Paths**: 100% coverage (checkout, auth, payments)

6. **Avoid Test Debt**
- Never skip tests - fix or remove
- Keep tests fast (<100ms each)
- Mock external dependencies (API, timers)
- Use `test.skip` only for known issues with tracking tickets
- Review test output - fix flaky tests immediately

7. **CI Integration**
```yaml
# .github/workflows/test.yml
- name: Run tests
  run: pnpm test --coverage
- name: Upload coverage
  uses: codecov/codecov-action@v4
```

### Running Tests

```bash
pnpm test        # Run tests once
pnpm test:watch # Run tests in watch mode
```

### Test Organization

- Put tests alongside source files with `.test.ts` or `.spec.ts` suffix.
- Use co-located tests: `utils.ts` → `utils.test.ts`
- Feature tests: `src/components/feature/Feature.tsx` → `src/components/feature/Feature.test.tsx`

```text
src/
  components/
    Button/
      Button.tsx
      Button.test.tsx
  lib/
    utils.ts
    utils.test.ts
  hooks/
    use-counter.ts
    use-counter.test.ts
```

### Unit Testing

Test pure functions and utilities in isolation.

```tsx
// src/lib/utils.test.ts
import { describe, it, expect } from 'vitest'
import { cn } from './utils'

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('handles conditional classes', () => {
    expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz')
  })
})
```

### Component Testing

Use React Testing Library for component tests. Test user interactions, not implementation details.

```tsx
// src/components/Button/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Button } from './Button'

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toHaveTextContent('Click me')
  })

  it('calls onClick handler', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    fireEvent.click(screen.getByRole('button'))
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('shows loading state', () => {
    render(<Button loading>Submit</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
```

### Hook Testing

Create a test wrapper component or use `@testing-library/react-hooks`.

```tsx
import { renderHook, act } from '@testing-library/react'
import { useCounter } from './use-counter'

describe('useCounter', () => {
  it('increments count', () => {
    const { result } = renderHook(() => useCounter())
    
    act(() => {
      result.current.increment()
    })
    
    expect(result.current.count).toBe(1)
  })
})
```

### Testing Forms

Test form validation, submission, and error states.

```tsx
describe('UserForm', () => {
  it('shows validation errors', async () => {
    render(<UserForm />)
    
    fireEvent.submit(screen.getByRole('form'))
    
    expect(await screen.findByText('Name is required')).toBeInTheDocument()
  })

  it('submits form data', async () => {
    const onSubmit = vi.fn()
    render(<UserForm onSubmit={onSubmit} />)
    
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John' } })
    fireEvent.submit(screen.getByRole('form'))
    
    expect(onSubmit).toHaveBeenCalledWith({ name: 'John' })
  })
})
```

### Testing Server Functions

Mock server functions for testing.

```tsx
import { createServerFn } from '@tanstack/react-start'

const getUser = createServerFn({ method: 'GET' })
  .handler(async () => ({ id: '1', name: 'John' }))

// In test, mock the implementation
vi.mock('@tanstack/react-start', async () => {
  const actual = await vi.importActual('@tanstack/react-start')
  return {
    ...actual,
    createServerFn: () => ({
      handler: () => vi.fn().mockResolvedValue({ id: '1', name: 'John' })
    })
  }
})
```

### Best Practices

1. **Test behavior, not implementation** - Test what users see, not how it's implemented
2. **Use semantic queries** - Prefer `getByRole`, `getByLabelText` over `getByTestId`
3. **Mock external dependencies** - API calls, browser APIs, third-party libs
4. **Keep tests fast** - Unit tests should run in milliseconds
5. **One assertion per test** - Easier to diagnose failures
6. **Use descriptive test names** - `it('should validate email format')` not `it('test1')`

### Test Coverage

Run with coverage:

```bash
pnpm test --coverage
```

Aim for:
- **Utilities/hooks**: 90%+ coverage
- **Components**: Critical paths covered
- **Integration**: Key user flows covered

## 16. Branding Configuration

All tenant-specific branding should use the centralized config in `src/config/branding.ts`.

```typescript
// src/config/branding.ts
export interface BrandingConfig {
  tenantId: string;
  tenantName: string;
  brandColor: string;
  brandColorForeground: string;
  logoUrl?: string;
  faviconUrl?: string;
}

export const defaultBranding: BrandingConfig = {
  tenantId: 'default',
  tenantName: 'BNB',
  brandColor: '#871d36',
  brandColorForeground: '#ffffff',
};
```

### Using Branding

```typescript
import { usePublicAuthContext } from '@/contexts/PublicAuthContext';

function MyComponent() {
  const { tenantName, brandColor, logoUrl } = usePublicAuthContext();
  // Use in your component
}
```

### CSS Variables

Brand colors are available as CSS variables:
- `--tenant-primary` - Main brand color (default: #871d36)
- `--tenant-primary-foreground` - Text on brand color

## 17. Internationalization (i18n)

All user-facing text must come from translation files. No hardcoded strings in components.

### File Structure

```
src/i18n/
├── i18n.ts              # i18n utilities and t() function
└── locales/
    └── en.json          # English translations
```

### Adding Translations

1. Add keys to `src/i18n/locales/en.json`
2. Use the `t()` function in components

### Translation File Structure

```json
{
  "common": {
    "required": "required",
    "loading": "Loading..."
  },
  "auth": {
    "login": {
      "title": "Welcome Back!",
      "subtitle": "Sign in to continue to {{tenantName}} Dashboard"
    }
  }
}
```

### Using Translations

```typescript
import { t } from '@/i18n/i18n';

// Simple translation
<t('auth.login.title') />

// With parameters (use {{variableName}} in JSON)
<t('auth.login.subtitle', 'en', { tenantName }) />
```

### Adding New Languages

1. Create `src/i18n/locales/{lang}.json`
2. Update `src/i18n/i18n.ts` to include the new locale

## 18. New Feature Checklist

- Add routes in `src/routes/` using `createFileRoute`.
- Run `pnpm generate-routes` to regenerate the route tree.
- Add API functions using `createServerFn` from `@tanstack/react-start`.
- Add pages with proper form validation using React Hook Form + Zod.
- **Add tests for new components, hooks, and utilities.**
- Add shared components to `src/components/`.
- Use branding config for tenant-specific values.
- Add all user-facing text to translation files.
- Run `pnpm build` to verify.
- Run `pnpm test` to ensure tests pass.
