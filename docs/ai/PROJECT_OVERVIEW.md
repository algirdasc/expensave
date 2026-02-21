# Project overview (Expensave)

Expensave is an expense tracking application.

## Tech stack

- **Backend:** Symfony (PHP >= 8.3), Doctrine ORM, JWT auth (LexikJWT + refresh tokens)
- **Frontend:** Angular **v20** (planned upgrade to **v21**), Nebular UI, Bootstrap
- **State/data:** TanStack Query is installed and bootstrapped, migration in progress

## Repository layout

- `backend/` – Symfony app
  - `src/` – application code
  - `tests/` – PHPUnit tests
  - `migrations/` – Doctrine migrations
- `frontend/` – Angular app
  - `src/app/api/` – API services + typed objects
  - `src/app/modules/` – feature modules (auth, main, reports)
  - `src/app/queries/` – TanStack Query option factories (queryOptions/mutationOptions)

## Backend patterns (at a glance)

- **Controllers** under `backend/src/Controller/*` expose JSON endpoints.
- **Request DTOs** under `backend/src/Request/*` are injected into controller actions and auto-populated from the HTTP request.
- **Validation** uses Symfony Validator attributes on Request DTO properties.
- **Entity resolution** uses a custom `#[ResolveEntity]` attribute + transformation handlers to turn IDs into Doctrine entities.
- **Authorization** uses Symfony Security **Voters** (`backend/src/Security/Voters/*`) and `denyAccessUnlessGranted(...)`.
- **Serialization groups** are used heavily for API responses (`ContextGroupConst` and per-domain group consts).
- **Async work** uses Symfony Messenger (`Message`/`MessageHandler`).

## Frontend patterns (at a glance)

- Angular is bootstrapped via `bootstrapApplication(...)` in `frontend/src/main.ts`.
- API calls are wrapped in `*ApiService` classes under `src/app/api/`.
- TanStack Query is provided globally (`provideTanStackQuery(queryClient, ...)`).
- Some routes prefetch data via resolvers using `queryClient.ensureQueryData(...)`.

## Current known gaps / roadmap

- Backend test coverage exists but should be expanded.
- Frontend has **no test coverage** (no current plan, but tests are welcome if low-friction).
- TanStack Query is set up but not yet used everywhere; older state patterns should be treated as **legacy**.
- Frontend components need splitting into smaller, more maintainable units.
