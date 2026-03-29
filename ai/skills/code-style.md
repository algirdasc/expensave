# Skill: Code Style & Conventions

## PHP (Backend)

### Standards
- **PSR-4** autoloading (`App\` namespace at `backend/src/`)
- **Symfony Coding Standards** (similar to PSR-12 with Symfony extensions)
- `declare(strict_types=1)` at the top of every PHP file

### Naming
| Thing              | Convention            | Example                        |
|--------------------|-----------------------|--------------------------------|
| Classes            | PascalCase            | `ExpenseController`            |
| Interfaces         | PascalCase + Interface| `TransformationHandlerInterface`|
| Enums              | PascalCase            | `CategoryType`                 |
| Methods            | camelCase             | `getCalendar()`                |
| Properties         | camelCase             | `$createdAt`                   |
| Constants          | UPPER_SNAKE_CASE      | `ADD_EXPENSE`                  |
| Files              | Match class name      | `ExpenseController.php`        |

### Class Suffixes (enforced)
| Suffix              | What it is                          |
|---------------------|-------------------------------------|
| `Controller`        | HTTP endpoint handler               |
| `Request`           | Request DTO (input)                 |
| `Response`          | Response DTO (output)               |
| `Service`           | Business logic                      |
| `Repository`        | Data access                         |
| `Voter`             | Symfony Security voter              |
| `Message`           | Async message (Messenger)           |
| `MessageHandler`    | Handles an async Message            |
| `ContextGroupConst` | Serialization group constants class |

### PHP Specifics
- Use PHP 8 attributes (`#[Route]`, `#[Assert\*]`, `#[ResolveEntity]`, `#[CurrentUser]`) — not annotations.
- Use readonly properties where appropriate (PHP 8.1+).
- Use typed properties and return types everywhere.
- Use enums (`enum CategoryType: string`) instead of class constants for typed enumerations.

### Architecture Rules
- **Controllers must be thin** — delegate to services and repositories.
- **Never read from `Request` directly** in a controller — use Request DTOs.
- **Always authorize** with a Voter before accessing data.
- **Validate at the boundary** — use `#[Assert\*]` on Request DTOs, not inside services.
- **Consistent responses** — use `AbstractApiController::respond()` / `respondWithError()`.

---

## TypeScript (Frontend)

### Standards
- **Angular Style Guide** conventions
- **Strict TypeScript**: `strict: true`, `noImplicitAny`, `strictNullChecks`
- **Prettier** formatting (`.prettierrc.json`)
- **ESLint** with `@angular-eslint` + `@typescript-eslint` (flat config `eslint.config.mjs`)

### Naming
| Thing                | Convention    | Example                         |
|----------------------|---------------|---------------------------------|
| Files                | kebab-case    | `expense-list.component.ts`     |
| Classes              | PascalCase    | `ExpenseListComponent`          |
| Interfaces           | PascalCase    | `EntityInterface`               |
| Variables/props      | camelCase     | `selectedCalendar`              |
| Constants            | camelCase or UPPER_SNAKE | depends on scope      |
| Enums                | PascalCase    | `CategoryType`                  |

### File Suffixes (enforced by Angular conventions)
| Suffix              | What it is              |
|---------------------|-------------------------|
| `.component.ts`     | Angular component       |
| `.service.ts`       | Angular service         |
| `.module.ts`        | Angular module (legacy) |
| `api.service.ts`    | HTTP API service        |
| `.queries.ts`       | TanStack Query factory  |
| `.interceptor.ts`   | HTTP interceptor        |
| `.directive.ts`     | Angular directive       |
| `.pipe.ts`          | Angular pipe            |

### Component Rules
- **Standalone components** — always use `imports: [...]` on the component decorator, not NgModules.
- **Presentational components**: only `@Input()` and `@Output()`, no API calls, no QueryClient.
- **Container components**: own data fetching via TanStack Query; wire inputs/outputs.
- Prefer `templateUrl` + `styleUrls` over inline templates for any non-trivial component.
- Keep components focused. If a component file exceeds ~200–300 lines, it needs splitting.

### Import Ordering (Prettier + ESLint enforced)
1. Angular core imports
2. Third-party imports (Nebular, TanStack, RxJS)
3. App imports (relative paths)

### Avoid
- `any` type (ESLint will catch it under strict config)
- Direct `subscribe()` for server data — use `injectQuery()` instead
- Long-lived singletons holding server data — use TanStack Query cache
- Inline templates with >10 lines of markup

---

## Git Commit Messages

- Use imperative present tense: `Add expense import`, not `Added` or `Adding`.
- Keep the subject line under 72 characters.
- Add `Co-Authored-By: Paperclip <noreply@paperclip.ing>` when committing as an AI agent.

## PR Size Rule

Keep PRs small and focused. One behavior change per PR. Large PRs signal poor planning.
