# TanStack Query migration guide (Angular)

Goal: use **TanStack Query** as the primary mechanism for server-state (fetching, caching, invalidation) and reduce bespoke/imperative state management.

## Current state

- TanStack Query is installed: `@tanstack/angular-query-experimental`
- Global provider exists in `src/main.ts`:
  - `provideTanStackQuery(queryClient, withDevtools())`
  - `QueryClient` invalidates queries on mutation success using `mutationKey`
- Query option factories exist in `src/app/queries/*` (e.g. `CalendarQueries`)
- Some routes prefetch data using `queryClient.ensureQueryData(...)`

## Project conventions (recommended)

### 1) Query keys

- Use stable, descriptive keys.
- Prefer a consistent shape:
  - list: `['calendar', { params }]`
  - detail: `['calendar', { id }]`

### 2) Query option factories

Keep query definitions in `src/app/queries/`.

- `queryOptions({ queryKey, queryFn })`
- `mutationOptions({ mutationKey, mutationFn })`

This keeps components thin and makes keys reusable.

### 3) Components should not own server state

Avoid:

- manual `subscribe()` + `ngOnDestroy` cleanup for server data
- storing server responses in long-lived singleton services
- custom “refresh” event buses

Prefer:

- `injectQuery(...)` / `injectMutation(...)` (TanStack Angular adapter)
- `queryClient.invalidateQueries(...)` for refresh

### 4) Invalidation strategy

The app currently invalidates by `mutationKey` on success.

Implication: mutation keys should match the query keys you want to refresh.

Example:

- queries: `['calendar', ...]`
- mutationKey: `['calendar']`

This will invalidate all calendar queries.

### 5) Route resolvers

Resolvers are already used to prefetch critical data.

- Keep resolvers for “must-have before render” data.
- For non-critical data, fetch inside the component with TanStack Query.

## Migration playbook (practical)

1. Identify a screen that currently:
   - calls an `ApiService` directly
   - stores results in component fields
   - manually refreshes after mutations
2. Create/extend a `*Queries` class in `src/app/queries/`.
3. Replace imperative fetching with `injectQuery(...)`.
4. Replace imperative mutation flows with `injectMutation(...)`.
5. Ensure mutation keys cause the right invalidations.
6. Delete dead code paths (old state, manual refresh logic) once stable.

## What to treat as legacy

- Any custom state containers that duplicate TanStack Query caching.
- Components that pass server data through many layers just to avoid refetching.

## When *not* to use TanStack Query

- Pure UI state (open/closed, selected tab) → keep local.
- Derived state from query data → compute in component.
- Very short-lived form state → keep in reactive forms.
