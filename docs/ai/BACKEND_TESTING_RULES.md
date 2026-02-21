# Backend testing rules (PHPUnit)

Location: `expensave/backend/tests/`

The backend already has a test harness (`ApplicationTestCase`) that:

- boots the Symfony kernel
- resets DB auto-increment counters
- loads fixtures from `backend/src/DataFixtures`
- uses `DAMA\DoctrineTestBundle` to wrap each test in a transaction
- provides helpers for authenticated requests (JWT)

## How to run tests

From `expensave/backend/`:

```bash
composer install
./vendor/bin/phpunit
```

## Test types to prefer

### 1) Application/API tests (preferred)

Most tests should exercise real HTTP endpoints using the Symfony test client.

- Use `ApplicationTestCase::getAuthenticatedClient()` for authenticated endpoints.
- Assert status codes, response JSON, and side effects in the database.
- When response shape matters, compare to a JSON fixture file.

### 2) Service tests

For pure domain logic (calculations, parsing, etc.), test services directly.

- Keep them fast.
- Avoid mocking Doctrine unless unavoidable.

## Rules for adding tests (project policy)

1. **If you change API behavior, add/adjust an API test.**
2. **If you change business logic, add/adjust a service test.**
3. Prefer **real code paths** over mocks.
4. Use fixtures for setup; don’t hand-roll large object graphs in each test.
5. Keep tests deterministic:
   - avoid relying on current time; pass explicit dates
   - avoid random values
6. Assert the important things only:
   - status code
   - response JSON (or key fields)
   - DB side effects
7. One behavior per test. If a test name needs “and”, split it.

## Recommended coverage targets (pragmatic)

- Controllers: cover happy path + at least one failure path (auth/validation).
- Voters: cover permission boundaries.
- Request DTOs: cover validation rules indirectly via controller tests.
- Critical services (imports, calculations): cover edge cases.

## Patterns to copy

### Authenticated request

```php
$client = $this->getAuthenticatedClient();
$client->request('GET', '/api/calendar');
$this->assertResponseIsSuccessful();
```

### JSON fixture comparison

```php
$this->assertResponseEqualToJson($client->getResponse(), 'Response/Calendar/calendar-list.json');
```

### Authorization failures

- Use existing tests like `AccessDeniedTest` / `AuthenticationRequiredTest` as templates.

## What not to do

- Don’t add brittle tests that depend on exact ordering unless the API guarantees it.
- Don’t mock the Symfony container.
- Don’t bypass the Request DTO pattern in tests; test the API as clients use it.
