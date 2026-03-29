# Skill: TanStack Query (Angular)

Package: `@tanstack/angular-query-experimental` v5

## Setup (already done)

`frontend/src/main.ts` bootstraps TanStack Query globally:

```typescript
const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onSuccess: (_data, _variables, _context, mutation) => {
      // Auto-invalidate queries matching the mutation key on success
      queryClient.invalidateQueries({ queryKey: mutation.options.mutationKey });
    },
  }),
});

bootstrapApplication(AppComponent, {
  providers: [
    provideTanStackQuery(queryClient, withDevtools()),
    // ...
  ]
});
```

## Query Option Factories

Query definitions belong in `frontend/src/app/queries/`. Use `queryOptions()` / `mutationOptions()`:

```typescript
// calendar.queries.ts
@Injectable({ providedIn: 'root' })
export class CalendarQueries {
  constructor(private calendarApiService: CalendarApiService) {}

  list() {
    return queryOptions({
      queryKey: ['calendar'],
      queryFn: () => firstValueFrom(this.calendarApiService.list()),
    });
  }

  detail(id: number) {
    return queryOptions({
      queryKey: ['calendar', { id }],
      queryFn: () => firstValueFrom(this.calendarApiService.get(id)),
    });
  }

  create() {
    return mutationOptions({
      mutationKey: ['calendar'],  // matches list() queryKey → auto-invalidates on success
      mutationFn: (calendar: Calendar) => firstValueFrom(this.calendarApiService.create(calendar)),
    });
  }
}
```

## Query Key Conventions

Use consistent, stable shapes:

| Pattern       | Key shape                      |
|---------------|--------------------------------|
| List          | `['calendar']`                 |
| List + filter | `['calendar', { params }]`     |
| Detail        | `['calendar', { id }]`         |

**Invalidation rule:** mutation `mutationKey` matches the query key you want to refresh. The global `MutationCache.onSuccess` handler does the invalidation automatically.

## Using Queries in Components

Use the Angular TanStack Query adapter APIs (not React-style hooks):

```typescript
@Component({ ... })
export class CalendarListComponent {
  private calendarQueries = inject(CalendarQueries);

  calendarsQuery = injectQuery(() => this.calendarQueries.list());
  createMutation = injectMutation(() => this.calendarQueries.create());
}
```

In the template:
```html
@if (calendarsQuery.isLoading()) {
  <nb-spinner />
} @else {
  @for (cal of calendarsQuery.data(); track cal.id) {
    <app-calendar-card [calendar]="cal" />
  }
}
```

## Route Resolvers (Prefetching)

Resolvers preload critical data before the route renders:

```typescript
// app.routes.ts
{
  path: 'calendar',
  resolve: {
    calendars: () => inject(QueryClient).ensureQueryData(
      inject(CalendarQueries).list()
    ),
  },
  ...
}
```

Components read this via `ActivatedRoute.snapshot.data.calendars` or via `injectQuery()` (data is already in cache).

## Invalidation

To force a refetch after an operation:

```typescript
this.queryClient.invalidateQueries({ queryKey: ['calendar'] });
```

Prefer relying on the automatic invalidation via `mutationKey` matching, and only call `invalidateQueries` manually when needed for cross-domain invalidations.

## When NOT to Use TanStack Query

- **UI state** (sidebar open/closed, selected tab) → keep in component local state.
- **Derived/computed data** from query results → compute inline in the component.
- **Short-lived form state** → Angular reactive forms.

## Migration Playbook (Legacy → TanStack Query)

1. Identify a component that: calls `ApiService` directly, stores result in a field, refreshes manually after mutations.
2. Create or extend a `*Queries` class in `src/app/queries/`.
3. Replace imperative `subscribe()` with `injectQuery()`.
4. Replace imperative mutation flow with `injectMutation()`.
5. Verify mutation keys cause the right invalidations.
6. Delete dead code (old state, manual refresh, stale service fields).

See `docs/ai/FRONTEND_TANSTACK_QUERY_MIGRATION.md` for the full migration playbook.
