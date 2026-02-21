# Frontend (Angular) guide

Location: `expensave/frontend/`

## Versions

- Current: **Angular v20**
- Planned: upgrade to **v21**

## How the frontend is structured

Key folders under `frontend/src/app/`:

- `modules/` – feature modules (auth, main, reports)
- `api/` – API services and typed objects
- `queries/` – TanStack Query option factories
- `interceptors/` – HTTP interceptors (auth, error handling, etc.)

Bootstrap happens in `frontend/src/main.ts` using `bootstrapApplication(...)`.

## Data access

- API calls are implemented in `src/app/api/*ApiService`.
- These services return RxJS Observables.

## TanStack Query status

TanStack Query is already wired:

- `provideTanStackQuery(queryClient, withDevtools())` in `main.ts`
- `QueryClient` is configured to invalidate queries on mutation success by `mutationKey`
- Route resolvers in `app.routes.ts` prefetch data via `queryClient.ensureQueryData(...)`

However, many components still use older patterns (manual subscriptions, local state, imperative refresh). Treat those as **legacy** and avoid copying them into new code.

## Frontend testing

- There are currently **no `*.spec.ts` tests**.
- There is no active plan to add a full test suite.
- If you add tests, keep them low-friction (e.g., pure function tests, small component tests) and avoid introducing heavy new tooling.

## Upgrade-to-v21 notes (for future work)

When upgrading Angular:

- keep dependencies aligned (`@angular/*`, `@angular-devkit/*`, `@angular-eslint/*`)
- run `ng update` in a clean branch
- expect some ecosystem lag (Nebular, TanStack experimental adapter)
- prefer incremental upgrades: compile first, then fix lint, then runtime
