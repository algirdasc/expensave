# Skill: Project Overview

## What is Expensave?

Expensave is an open-source personal and family expense tracking application.

**Key features:**
- Multiple expense calendars per user (share calendars with family members)
- Track expenses and income (negative amount = expense, positive = income)
- Expense categories with auto-categorization rules
- Bank statement import (multiple formats via PHPSpreadsheet)
- Reports: monthly summaries, daily breakdowns, category breakdowns
- PWA (Progressive Web App) support for mobile

**Users / Personas:**
- Single users tracking personal spending
- Families sharing a calendar for household expenses

## Tech Stack

| Layer      | Technology                                                          |
|------------|---------------------------------------------------------------------|
| Backend    | PHP 8.3, Symfony 7.1, Doctrine ORM 3.2                             |
| Auth       | LexikJWT + gesdinet/jwt-refresh-token-bundle                        |
| Async      | Symfony Messenger (background expense import worker)                |
| Database   | MariaDB 11                                                          |
| Frontend   | Angular v20 (standalone components), Nebular UI v16                 |
| Data fetch | TanStack Query (`@tanstack/angular-query-experimental` v5)          |
| Charts     | Chart.js + ng2-charts                                               |
| Build      | Docker (multi-stage: Node build → PHP Apache image)                 |

## Repository Layout (top-level)

```
backend/       # Symfony app
frontend/      # Angular app
docker/        # Apache, PHP, MariaDB, supervisor config
docs/ai/       # Legacy AI guides (still valid reference)
ai/            # LLM skills (dynamic — update when you change things)
Dockerfile     # Multi-stage production build
docker-compose.yml
```

## Current State / Known Gaps

- TanStack Query is installed and wired, but many components still use older imperative patterns — **treat those as legacy**.
- Frontend has no test coverage (no requirement to add heavy infra, but lightweight tests are welcome).
- Frontend component splitting is in progress (large components need to be split into container + presentational).
- Angular v20 is current; v21 upgrade is planned.

## Roadmap

- Complete TanStack Query migration in frontend components.
- Split heavy components (e.g., header) into smaller focused units.
- Expand backend test coverage.
