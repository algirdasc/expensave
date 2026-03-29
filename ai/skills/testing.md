# Skill: Testing

## Backend (PHPUnit)

**Framework:** PHPUnit 12.0
**Location:** `backend/tests/`
**Run:** `cd backend && ./vendor/bin/phpunit`

### Test Infrastructure

`ApplicationTestCase` (base class for all tests) provides:
- Symfony kernel boot
- DB wrapped in a transaction (DAMA\DoctrineTestBundle — rolled back after each test)
- Fixtures loaded from `backend/src/DataFixtures/`
- `getAuthenticatedClient()` — returns a test HTTP client with a valid JWT

### Test Types

**1. Application/API tests (preferred)**

Test real HTTP endpoints through the Symfony test client:

```php
class ExpenseControllerTest extends ApplicationTestCase
{
    public function testCreateExpense(): void
    {
        $client = $this->getAuthenticatedClient();
        $client->request('POST', '/api/expense', [], [], [], json_encode([
            'label' => 'Groceries',
            'amount' => -45.00,
            'calendar' => 1,
        ]));
        $this->assertResponseIsSuccessful();
    }
}
```

**2. Service tests**

Test pure business logic (calculations, parsers) directly, without HTTP:

```php
class BalanceCalculatorServiceTest extends KernelTestCase
{
    public function testCalculatesBalance(): void
    {
        $service = self::getContainer()->get(BalanceCalculatorService::class);
        // ...
    }
}
```

### Useful Assertions

```php
$this->assertResponseIsSuccessful();   // 2xx status
$this->assertResponseStatusCodeSame(403);
// JSON fixture comparison:
$this->assertResponseEqualToJson($client->getResponse(), 'Response/Calendar/calendar-list.json');
```

### Authorization / Auth Tests

Use existing `AccessDeniedTest` and `AuthenticationRequiredTest` classes as templates for:
- Testing that unauthenticated requests return 401
- Testing that unpermitted users get 403

### Test Policy

1. **If you change API behavior, add/adjust an API test.**
2. **If you change business logic, add/adjust a service test.**
3. Prefer real code paths over mocks.
4. Use fixtures for setup — don't hand-roll large object graphs in tests.
5. Keep tests deterministic: pass explicit dates, no random values.
6. Assert the important things: status code, response JSON, DB side effects.
7. **One behavior per test.** If the name needs "and", split it.

### Coverage Targets

| Area              | Target                                               |
|-------------------|------------------------------------------------------|
| Controllers       | Happy path + one failure (auth or validation)        |
| Voters            | Both sides of each permission boundary               |
| Request DTOs      | Indirectly via controller tests                      |
| Critical services | Edge cases (imports, calculations)                   |

### What NOT to Do

- Don't mock the Symfony container.
- Don't mock Doctrine unless truly unavoidable.
- Don't bypass Request DTO pattern in tests — test as a real client would.
- Don't write brittle tests relying on ordering unless the API guarantees it.

---

## Frontend (Angular)

**Current status:** No test files exist (`*.spec.ts`). No active test plan.

**Policy:**
- Tests are welcome if they are **low-friction** (pure function tests, small component tests).
- Do NOT introduce heavy new tooling (no Karma/Jasmine setup required).
- Best candidates: pure utility functions in `src/app/util/`, simple pipes, stateless presentational components.

**If you add tests:**
- Prefer Vitest or Jest (lighter than Karma) if adding a runner.
- Keep test files colocated: `expense-utils.spec.ts` next to `expense-utils.ts`.
- Don't test implementation details — test observable behavior.

---

## CI

Tests run automatically in GitHub Actions (`code-quality.yml`):
- Backend: `composer install` → PHPUnit (with MariaDB test DB)
- Frontend: `npm ci --legacy-peer-deps` → ESLint (`npm run analyze`)

Do not push code that breaks CI.
