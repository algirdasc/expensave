# Skill: Deployment & Local Setup

## Local Development

### Backend only

```bash
cd backend
composer install
cp .env .env.local  # then edit DB credentials
php -S 0.0.0.0:18001 -t ./public ./config/router.php
```

### Frontend only

```bash
cd frontend
nvm use v20    # Node v20 required
npm install
npm run dev    # Vite dev server at http://localhost:4200
```

> **Note:** If running in a production-like environment, `NODE_ENV=production` causes `npm install` to skip devDependencies. Use `npm install --include=dev` or use `npm ci --legacy-peer-deps` (as done in CI).

### Full stack (Docker Compose)

```bash
# Production-like (MariaDB + PHP Apache):
docker compose up

# Development (with Xdebug, hot reload):
docker compose -f docker-compose.development.yml up
```

App is available at:
- Frontend: `http://localhost:18000/ui/`
- API: `http://localhost:18000/api/`

## Docker Architecture

### Dockerfile (multi-stage)

```
Stage 1 — frontend (node:24-alpine)
  → npm ci && npm run build
  → Output: dist/browser/

Stage 2 — expensave-base (php:8.3-apache)
  → Install PHP extensions: pdo_mysql, zip, intl, curl, gd, ...
  → Install Composer

Stage 3 — application
  → Copy built frontend from Stage 1
  → Copy backend
  → composer install --no-dev
  → Configure Apache
```

### Services (docker-compose.yml)

| Service      | Image             | Port         | Notes                              |
|--------------|-------------------|--------------|------------------------------------|
| `application`| php:8.3-apache    | 18000:18000  | Symfony + Angular bundle           |
| `database`   | mariadb:11        | (internal)   | Data persisted in `./db/`          |

### Docker Config Files

```
docker/
├── apache2/
│   ├── app.conf            # Production Apache vhost
│   └── app.development.conf# Development vhost (with Xdebug headers)
├── php/
│   └── xdebug.ini          # PHP Xdebug config (development only)
├── cron.d/
│   └── expensave           # Cron job config
└── supervisor/
    └── supervisord.conf    # Supervisor config for Messenger worker
```

## Environment Variables

Key env vars (set in `.env` or `docker-compose.yml`):

| Variable                      | Purpose                                        |
|-------------------------------|------------------------------------------------|
| `APP_ENV`                     | `prod` or `dev`                                |
| `APP_SECRET`                  | Symfony secret key                             |
| `DATABASE_URL`                | `mysql://user:pass@host:3306/expensave`        |
| `JWT_SECRET_KEY`              | Path to JWT private key                        |
| `JWT_PUBLIC_KEY`              | Path to JWT public key                         |
| `JWT_PASSPHRASE`              | JWT key passphrase                             |
| `LOCALE`                      | e.g. `en_US`                                   |
| `REGISTRATION_DISABLED`       | Set to `true` to disable new user registration |
| `ANONYMOUS_DATA_COLLECTION_DISABLED` | Disable PostHog analytics             |

## Database

- MariaDB 11
- Credentials: `expensave` / `expensave` / `expensave` (user/pass/db) by default
- Migrations: `cd backend && php bin/console doctrine:migrations:migrate`
- Create schema for tests: `php bin/console doctrine:schema:create --env=test`

## CI/CD (GitHub Actions)

**File:** `.github/workflows/code-quality.yml`

Triggers: on PR, on push to main.

Steps:
1. Sparse checkout (backend/ only for backend jobs, frontend/ only for frontend)
2. Backend: `composer install` → PHPStan → PHPUnit (with MariaDB service container)
3. Frontend: `npm ci --legacy-peer-deps` → `npm run analyze` (ESLint)

**Dependabot:** configured to auto-update both backend and frontend dependencies in groups.

> **Gotcha (npm/Angular):** npm 11 enforces strict peer deps. When Dependabot bumps Angular packages individually, lockfile can go out of sync. Use `npm ci --legacy-peer-deps` in CI as a safety net and keep all `@angular/*` packages at the same version.

## Messenger Worker

The Symfony Messenger async worker (for bank statement import) runs as a supervised process inside the Docker container:
```bash
php bin/console messenger:consume async
```
Configured via `docker/supervisor/supervisord.conf`.
