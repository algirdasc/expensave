# AGENTS.md (AI contributor guide)

This repository contains **Expensave**, a personal/family expense tracking app.

- **Backend:** Symfony (PHP >= 8.3) in `expensave/backend/`
- **Frontend:** Angular v20 in `expensave/frontend/` (planned upgrade to v21)

## Quick start (local dev)

### Backend

```bash
cd expensave/backend
composer install
php -S 0.0.0.0:18001 -t ./public ./config/router.php
```

### Frontend

```bash
cd expensave/frontend
nvm use v20
npm install
npm run dev
```

## Where things live

- Backend code: `expensave/backend/src/`
- Backend tests: `expensave/backend/tests/`
- Frontend app: `expensave/frontend/src/app/`
- Frontend API clients: `expensave/frontend/src/app/api/`
- Frontend TanStack Query definitions: `expensave/frontend/src/app/queries/`

## High-level architecture

- The backend exposes a JSON API under routes like `api/*`.
- The frontend is a SPA that talks to the backend via Angular `HttpClient` services.
- TanStack Query is set up in the frontend bootstrap (`provideTanStackQuery(...)`) and route resolvers already use `queryClient.ensureQueryData(...)`, but many UI flows still rely on older state patterns.

## AI contribution rules (project-specific)

1. Prefer **small, reviewable PR-sized changes**.
2. Keep backend changes aligned with existing patterns (Request DTOs, Voters, Repositories, Response groups).
3. Frontend refactors should move state/data fetching toward **TanStack Query**; avoid adding new bespoke state containers.
4. Tests:
   - Backend: add/extend PHPUnit tests when touching business logic or API behavior.
   - Frontend: no formal requirement, but lightweight tests are welcome if they don’t add heavy infra.

## Read next

- `docs/ai/PROJECT_OVERVIEW.md`
- `docs/ai/BACKEND_SYMFONY_GUIDE.md`
- `docs/ai/BACKEND_TESTING_RULES.md`
- `docs/ai/FRONTEND_ANGULAR_GUIDE.md`
- `docs/ai/FRONTEND_TANSTACK_QUERY_MIGRATION.md`
- `docs/ai/FRONTEND_COMPONENT_SPLITTING_GUIDE.md`
