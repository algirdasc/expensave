# Skill: Frontend Architecture (Angular)

Location: `frontend/`
Framework: Angular v20 (standalone components), Nebular UI v16

## Directory Structure

```
frontend/src/app/
├── api/               # HTTP API service layer
│   ├── *api.service.ts         # Typed service per domain
│   ├── objects/                # Typed data models (Expense, Calendar, ...)
│   ├── request/                # Request DTO classes
│   └── response/               # Response types
├── modules/           # Lazy-loaded feature modules
│   ├── auth/          # Login, registration, password reset
│   ├── main/          # Calendar view + expense management
│   │   ├── calendar/           # Calendar grid components
│   │   ├── components/         # Shared sub-components
│   │   ├── dialogs/            # Modal dialogs
│   │   ├── header/             # Header with nav (currently being split)
│   │   ├── services/           # LocalService, StatementImportService
│   │   └── main.service.ts     # MainService — calendar/user state
│   └── reports/       # Charts and reports
├── queries/           # TanStack Query option factories
│   ├── user.queries.ts
│   ├── calendar.queries.ts
│   └── category.queries.ts
├── interceptors/      # HTTP interceptors (auth, error, date, API base URL)
├── services/          # Global services (auth)
├── directives/        # Custom directives (e.g. swipe)
├── pipes/             # Custom Angular pipes
├── util/              # Pure utility functions
├── interfaces/        # TypeScript interfaces
├── animations/        # Angular animations
├── app.routes.ts      # Routing + route resolvers
├── app.component.ts   # Root component
└── app.initializer.ts # App init (locale, currency)
```

## Bootstrap

`frontend/src/main.ts` bootstraps the app with `bootstrapApplication(AppComponent, config)`.

TanStack Query is provided here:

```typescript
provideTanStackQuery(queryClient, withDevtools())
```

`QueryClient` auto-invalidates queries by `mutationKey` on every mutation success.

## API Service Pattern

All domain API services extend `AbstractEntityApiService<T>`:

```typescript
@Injectable()
export class ExpenseApiService extends AbstractEntityApiService<Expense> {
  protected backend = '/expense';
  protected entity: Type<EntityInterface> = Expense;

  // CRUD inherited: list(), get(id), create(obj), update(obj), delete(id)
  suggest(label: string): Observable<Expense> { ... }
  import(expenses: Expense[]): Observable<Expense[]> { ... }
}
```

- Return types are RxJS `Observable<T>`.
- `class-transformer` deserializes responses into typed objects.

## Data Models (objects/)

Key classes in `frontend/src/app/api/objects/`:

| Class            | Key Properties                                             |
|------------------|------------------------------------------------------------|
| `Expense`        | id, label, amount, createdAt, calendar, user, category, confirmed |
| `Calendar`       | id, name, shared, balance, owner, collaborators            |
| `Category`       | id, name, shared, type (CategoryType enum)                 |
| `User`           | id, email, name, active, defaultCalendarId                 |
| `BalanceMeta`    | balance reporting                                          |

## Routing and Route Resolvers

`app.routes.ts` defines lazy-loaded routes with resolvers that prefetch data:

```typescript
{
  path: 'calendar',
  loadComponent: () => import('./modules/main/main.component'),
  resolve: {
    user: (route, state) => queryClient.ensureQueryData(userQueries.profile()),
    calendars: (route, state) => queryClient.ensureQueryData(calendarQueries.list()),
  }
}
```

Components receive prefetched data via `ActivatedRoute.data` snapshot.

## HTTP Interceptors

| Interceptor             | Purpose                                         |
|-------------------------|-------------------------------------------------|
| Auth interceptor        | Attaches JWT Bearer token to requests           |
| Error interceptor       | Global HTTP error handling                      |
| Date interceptor        | ISO date string ↔ JS Date conversion            |
| API interceptor         | Prepends backend base URL                       |
| Unauthorized interceptor| Redirects to login on 401                      |

## UI Framework: Nebular

- Use `@nebular/theme` components: `nb-layout`, `nb-card`, `nb-button`, `nb-dialog`, etc.
- Theme name: `expensave` (custom theme configured in `app.module.ts`).
- Eva Icons via `@nebular/eva-icons`.

## Component Conventions

- **Standalone components** (Angular v15+ style) — use `imports: [...]` on each component.
- **Container components** own data fetching (via TanStack Query) and wire events.
- **Presentational components** receive `@Input()` and emit `@Output()` events. No API calls.
- Prefer `templateUrl` + `styleUrls` over inline templates for non-trivial components.
- Files: kebab-case (`expense-list.component.ts`), class names: PascalCase.

## Current Legacy Patterns (avoid copying)

- Manual `subscribe()` + `ngOnDestroy` for server data — replace with `injectQuery()`.
- Storing server responses in long-lived singleton services — use TanStack Query cache.
- Custom refresh event buses — use `queryClient.invalidateQueries()`.

See `ai/skills/tanstack-query.md` for migration guidance.

## Key Config Files

- `frontend/package.json` — v0.5.13; npm scripts: `dev`, `build`, `analyze`
- `frontend/angular.json` — build config, `baseHref: "/ui/"`
- `frontend/tsconfig.json` — strict mode, ES2020 target
- `frontend/eslint.config.mjs` — flat ESLint config with angular-eslint + prettier
- `frontend/.prettierrc.json` — Prettier formatting rules
