# AGENTS.md

## Scope

This file applies to the entire repository.

## Project Overview

Expensave is a split application:

- `backend/`: Symfony 7.1 API on PHP 8.3+
- `frontend/`: Angular 21 application with Nebular and Bootstrap

The app is an expense tracking system with authentication, shared calendars, statement import, and reports.

## Repository Layout

- `backend/src/Controller/`: API entry points
- `backend/src/Request/` and `backend/src/Response/`: transport models
- `backend/src/Entity/`, `Repository/`, `Service/`: domain and persistence logic
- `backend/src/Service/StatementImport/`: bank statement import pipeline
- `backend/tests/Application/`: application and service tests
- `frontend/src/app/modules/auth/`: auth flows
- `frontend/src/app/modules/main/`: main calendar/product flows
- `frontend/src/app/modules/reports/`: reporting UI
- `frontend/src/app/api/`, `queries/`, `services/`: API models, data fetching, and app services

## Working Style

- Keep changes scoped to the backend or frontend area you are modifying.
- Prefer existing Symfony and Angular patterns already used in the repo over introducing new abstractions.
- Preserve strict typing in PHP and TypeScript.
- Do not edit lockfiles unless dependency changes are required.
- Treat `.env` files as local configuration, not feature implementation targets, unless the task is explicitly about configuration.
- Do not assume direct push access to `main`; prepare changes on a branch and integrate through a pull request.

## Local Development

### Backend

Run from `backend/`:

```bash
composer install
php -S 0.0.0.0:18001 -t ./public ./config/router.php
```

### Frontend

Run from `frontend/`:

```bash
nvm use          # uses .nvmrc at repo root
npm ci
npm run dev
```

**Important:** Always run `nvm use` before any `npm` commands in the frontend to ensure the correct Node version from `.nvmrc` is active.

Frontend dev server runs on port `18002`.

## Validation

Run the narrowest useful checks for the files you changed.

### Backend checks

From `backend/`:

```bash
php bin/phpunit
vendor/bin/phpstan analyse
```

Backend tests rely on the test environment defined in `backend/phpunit.xml.dist` and fixtures loaded from `backend/src/DataFixtures`.

### Frontend checks

From `frontend/`:

```bash
npm run analyze
npm run build
```

## Change Guidance

### Backend

- Keep controllers thin; push business logic into services.
- When adding or changing API contracts, update the matching request/response DTOs and tests.
- If a feature changes persisted data, review whether a Doctrine migration is required.
- If you touch statement import logic, verify the related fixture-driven tests under `backend/tests/Files/StatementImport/`.

### Frontend

- Follow the existing module split: `auth`, `main`, and `reports`.
- Reuse the existing query/service layer instead of adding ad hoc fetch logic in components.
- Keep route-level data loading aligned with `frontend/src/app/app.routes.ts`.
- Match existing Nebular and Bootstrap usage before introducing new UI patterns.
- Prefer `takeUntilDestroyed` or snapshot-based route reads in components instead of long-lived manual subscriptions.
- Favor small private helper methods for route-state mapping and UI-only logic so future tests can target behavior without bootstrapping whole features.

## Frontend Refactor Log

- Current frontend cleanup is proceeding in small, reviewable chunks.
- First chunk focuses on root and top-level feature components:
  - remove unused injections and `any`-typed router event handling
  - replace long-lived component subscriptions with Angular-managed teardown
  - move route-data mapping into private helpers
  - keep existing TanStack Query usage untouched for now; do not refactor migrated query code until the broader migration pass

## Notes

- Backend and frontend are intended to run together during development on ports `18001` and `18002`.
- There is Docker support at the repo root, but the local dev commands above are the fastest path for targeted code changes.
- Repository rules may block direct pushes to `main`. Default to branch-based work and PR-ready changes.
