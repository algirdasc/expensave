# BOOTSTRAP.md — Expensave AI Onboarding

This is the entry point for any LLM working on the Expensave project.
Read this first, then read the relevant skill files in `ai/skills/`.

## What is Expensave?

Expensave is an open-source personal and family expense tracking web application.
It tracks income and spending across shared calendars, supports bank statement imports, and generates reports.

- **GitHub:** https://github.com/algirdasc/expensave
- **Stack:** PHP 8.3 + Symfony 7.1 (backend), Angular v20 + Nebular UI (frontend)
- **Database:** MariaDB 11 via Doctrine ORM
- **Auth:** JWT (LexikJWT) with refresh tokens

## Repository Layout

```
expensave/
├── backend/       # Symfony application (PHP 8.3)
│   ├── src/       # Application source (controllers, entities, services...)
│   ├── tests/     # PHPUnit tests
│   └── migrations/# Doctrine migrations
├── frontend/      # Angular application (v20)
│   └── src/app/
│       ├── api/       # Typed HTTP services
│       ├── modules/   # Feature modules (auth, main, reports)
│       ├── queries/   # TanStack Query option factories
│       └── interceptors/
├── docker/        # Apache2 + PHP + MariaDB configs
├── docs/ai/       # Legacy detailed guides (still valid reference)
└── ai/            # ← YOU ARE HERE — LLM skills and this bootstrap
    └── skills/    # Focused skill files (read as needed)
```

## How to Navigate This Project

| I need to know about...              | Read                                     |
|--------------------------------------|------------------------------------------|
| Project purpose and stack overview   | `ai/skills/project-overview.md`          |
| Backend (Symfony) patterns           | `ai/skills/backend-architecture.md`      |
| Frontend (Angular) patterns          | `ai/skills/frontend-architecture.md`     |
| Data model / entities                | `ai/skills/data-model.md`                |
| PHP/TypeScript coding conventions    | `ai/skills/code-style.md`                |
| Writing and running tests            | `ai/skills/testing.md`                   |
| Docker / deployment / local setup    | `ai/skills/deployment.md`                |
| TanStack Query usage in Angular      | `ai/skills/tanstack-query.md`            |

Legacy guides with more detail are also in `docs/ai/`.

## Quick Start Commands

### Backend
```bash
cd backend
composer install
php -S 0.0.0.0:18001 -t ./public ./config/router.php
# Run tests:
./vendor/bin/phpunit
```

### Frontend
```bash
cd frontend
nvm use v20
npm install
npm run dev
```

### Full stack (Docker)
```bash
docker compose up
# App accessible at http://localhost:18000
# Frontend at /ui/, API at /api/
```

## The `ai/` Directory Contract

The `ai/` directory is **dynamic**. Every time you make meaningful changes to the project:

1. Update the relevant skill file(s) in `ai/skills/` to reflect new patterns, decisions, or facts.
2. Add a new skill file if a new concern emerges that doesn't fit existing files.
3. Keep skill files focused and under ~150 lines. If a file grows large, split it.

This ensures `ai/` stays accurate and useful for every future LLM session.
