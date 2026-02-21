# Backend (Symfony) guide

Location: `expensave/backend/`

## How the backend is structured

Key folders under `backend/src/`:

- `Controller/` – HTTP endpoints (JSON API)
- `Request/` – request DTOs injected into controller actions
- `Response/` – response DTOs (and error response types)
- `Entity/` + `Repository/` – Doctrine entities and repositories
- `Security/Voters/` – authorization rules
- `Service/` – domain services
- `Message/` + `MessageHandler/` – async jobs via Symfony Messenger
- `Handler/Request/` – request transformation pipeline

## Patterns used (important)

### 1) Controller → Request DTO → Entity/Service → JSON response

Controllers typically:

- receive a `#[CurrentUser] User` when needed
- receive a typed `*Request` object (e.g. `CreateExpenseRequest`)
- call `denyAccessUnlessGranted(...)` with a Voter
- persist via a Repository (`save/remove`)
- return JSON via `AbstractApiController::respond(...)` with serialization groups

Example (simplified):

```php
#[Route('api/expense', name: 'expense_')]
class ExpenseController extends AbstractApiController
{
    #[Route('', methods: Request::METHOD_POST)]
    public function create(#[CurrentUser] User $user, CreateExpenseRequest $request): JsonResponse
    {
        $this->denyAccessUnlessGranted(CalendarVoter::ADD_EXPENSE, $request->getCalendar());

        $expense = (new Expense())
            ->setCalendar($request->getCalendar())
            ->setUser($user)
            ->setLabel($request->getLabel());

        $this->expenseRepository->save($expense);

        return $this->respond($expense, groups: ExpenseContextGroupConst::DETAILS);
    }
}
```

### 2) Request DTO auto-population (custom)

All request DTOs extend `App\Request\AbstractRequest`.

- The base class reads from the current HTTP request (`RequestStack`).
- It iterates over DTO properties and uses a chain of `TransformationHandlerInterface` implementations.
- This enables automatic conversion of raw request values into:
  - built-in types
  - objects
  - collections
  - uploaded files
  - **Doctrine entities**

### 3) `#[ResolveEntity]` attribute for entity lookup

Request DTO properties can be annotated with `#[ResolveEntity]`.

- The `EntityTransformationHandler` detects this attribute.
- It resolves the property value (usually an ID) into a Doctrine entity.
- It can also provide a default lookup via `defaultCriteria`.

Example:

```php
#[ResolveEntity]
protected Calendar $calendar;

#[ResolveEntity(defaultCriteria: ['type' => CategoryType::UNCATEGORIZED])]
protected Category $category;
```

### 4) Validation via Symfony Validator attributes

Request DTO properties use `#[Assert\*]` constraints.

Rule of thumb: validate at the boundary (Request DTO), not deep inside controllers.

### 5) Authorization via Voters

Controllers call `denyAccessUnlessGranted(...)` with domain-specific voters.

- Calendar permissions: `CalendarVoter`
- Expense permissions: `ExpenseVoter`

### 6) Serialization groups for API responses

`AbstractApiController::respond(...)` uses serializer groups.

- Group constants live under `App\Const\ContextGroup*`.
- Prefer adding/using groups rather than returning ad-hoc arrays.

### 7) Async processing via Messenger

Bulk operations (e.g. import) dispatch messages to the bus.

```php
$bus->dispatch(new ImportExpenseMessage(...));
```

## Conventions to follow

- Keep controllers thin; move business logic to Services/Repositories.
- Prefer Request DTOs over reading from `Request` directly.
- Always enforce authorization in controllers (Voters).
- Keep API responses consistent: use `respond(...)` / `respondWithError(...)`.
