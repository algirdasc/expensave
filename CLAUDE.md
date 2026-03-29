# CLAUDE.md — Expensave

Start here, then read `ai/BOOTSTRAP.md` for the full onboarding guide.

## Quick orientation

- **Project:** Expensave — personal/family expense tracking web app
- **Backend:** PHP 8.3 + Symfony 7.1 in `backend/`
- **Frontend:** Angular v20 + Nebular UI in `frontend/`
- **Database:** MariaDB 11 via Doctrine ORM
- **Auth:** JWT (LexikJWT + refresh tokens)

## Where to look for knowledge

Every time you need to understand the project — architecture, patterns, conventions, testing — read the skills in `ai/skills/`:

| Topic                         | File                                     |
|-------------------------------|------------------------------------------|
| Project purpose & stack       | `ai/skills/project-overview.md`          |
| Backend (Symfony) patterns    | `ai/skills/backend-architecture.md`      |
| Frontend (Angular) patterns   | `ai/skills/frontend-architecture.md`     |
| Data model / entities         | `ai/skills/data-model.md`                |
| Code style & naming           | `ai/skills/code-style.md`                |
| Testing                       | `ai/skills/testing.md`                   |
| Docker / local setup / CI     | `ai/skills/deployment.md`                |
| TanStack Query usage          | `ai/skills/tanstack-query.md`            |

Full onboarding: `ai/BOOTSTRAP.md`

## When you change something

Update the relevant skill file(s) in `ai/skills/` to reflect any new patterns, decisions, or facts you've introduced. Keep `ai/` accurate and current.
