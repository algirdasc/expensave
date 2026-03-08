# CLAUDE.md — Expensave project context

Last updated: 2026-03-01

## Repo
- GitHub: https://github.com/algirdasc/expensave

## Stack (observed)
### Frontend
- Angular (standalone components are used via `imports: [...]` on components)
- UI: Nebular (`@nebular/theme`, `@nebular/auth`, `@nebular/eva-icons`)
- TanStack Query: `@tanstack/angular-query-experimental`
  - Provided globally in `frontend/src/main.ts` via `provideTanStackQuery(queryClient, withDevtools())`
  - `QueryClient` configured with `MutationCache.onSuccess` that invalidates queries by `mutationKey`
- Routing: Angular router with route `resolve` using `QueryClient.ensureQueryData(...)` (see `frontend/src/app/app.routes.ts`)

### Backend
- Present under `/backend` (not analyzed deeply in this pass)

## TanStack Query conventions in this repo
- Query definitions are wrapped in injectable "Queries" services using `queryOptions` / `mutationOptions`.
  - Examples: `frontend/src/app/queries/user.queries.ts`, `calendar.queries.ts`, `category.queries.ts`
- Routes preload initial data using resolvers that call:
  - `queryClient.ensureQueryData(queries.someQuery())`

## Main calendar page
- `MainComponent` (`frontend/src/app/modules/main/main.component.ts`)
  - Reads `user`, `calendars`, `systemCategories` from route resolver data and stores them in `MainService`
  - Renders `<app-header>` inside `nb-layout-header`
  - Passes into header:
    - `[calendar]="mainService.calendar"`
    - `[visibleDateBalance]="mainService.visibleDateBalance"`
    - `[visibleDate]="mainService.visibleDate"`

## Header component (current)
- Path: `frontend/src/app/modules/main/header/`
- Inputs:
  - `calendar: Calendar`
  - `visibleDateBalance: number`
  - `visibleDate: Date`
- Responsibilities currently bundled:
  - Sidebar toggle (Nebular sidebar)
  - Statement import badge state (depends on `StatementImportService.expenses.length`)
  - Calendar info block (calendar name, balances, popover for month report)
  - Date navigation (prev/next/today) and view mode popover (date/year/month)

## Likely refactor goal (agreed direction)
- Split heavy header into smaller presentational + controller components.
- Use TanStack Query for header-relevant data where it makes sense (e.g., calendar details/balance, user profile, etc.), avoiding passing large objects deep when possible.

## Notes / gotchas
- Since `@tanstack/angular-query-experimental` is used, we should implement query usage via the Angular adapter APIs (not React-style hooks).
- The existing router resolvers already ensure query data; components should prefer `queryClient.getQueryData(...)` or query observers rather than refetching.
