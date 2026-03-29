# Skill: Backend Architecture (PHP / Symfony)

Location: `backend/`
Framework: Symfony 7.1, PHP >= 8.3, Doctrine ORM 3.2

## Directory Structure

```
backend/src/
├── Attribute/        # Custom PHP attributes (#[ResolveEntity])
├── Command/          # Symfony console commands
├── Const/            # Serialization group constant classes
├── Controller/       # HTTP API endpoints (JSON)
│   ├── Auth/         # Login, registration, password reset
│   ├── Finance/      # Calendar, expense, category, balance, import
│   └── Report/       # Monthly, daily, category reports
├── DTO/              # Data Transfer Objects
├── Entity/           # Doctrine ORM entities
├── Enum/             # PHP 8 enums (CalendarPermission, CategoryType, ...)
├── Handler/Request/  # Request transformation pipeline
├── Message/          # Async message classes (e.g. ImportExpenseMessage)
├── MessageHandler/   # Async message handlers
├── Repository/       # Doctrine repositories (data access)
├── Request/          # Request DTOs (auto-populated from HTTP request)
├── Response/         # Response DTOs
├── Security/Voters/  # Authorization logic
└── Service/          # Business logic services
```

## The Core Pattern: Controller → Request DTO → Service → Response

```php
#[Route('api/expense', name: 'expense_')]
class ExpenseController extends AbstractApiController
{
    #[Route('', methods: Request::METHOD_POST)]
    public function create(#[CurrentUser] User $user, CreateExpenseRequest $request): JsonResponse
    {
        // 1. Authorize
        $this->denyAccessUnlessGranted(CalendarVoter::ADD_EXPENSE, $request->getCalendar());

        // 2. Build entity
        $expense = (new Expense())
            ->setCalendar($request->getCalendar())
            ->setUser($user)
            ->setLabel($request->getLabel());

        // 3. Persist
        $this->expenseRepository->save($expense);

        // 4. Respond with serialization group
        return $this->respond($expense, groups: ExpenseContextGroupConst::DETAILS);
    }
}
```

## Request DTO Auto-Population

All request DTOs extend `App\Request\AbstractRequest`.

- The base class reads the current HTTP request via `RequestStack`.
- A chain of `TransformationHandlerInterface` implementations converts raw values into typed properties.
- Supported conversions: built-in types, objects, collections, uploaded files, Doctrine entities.

## `#[ResolveEntity]` — Entity Lookup from ID

Use on DTO properties to convert an incoming ID into a loaded Doctrine entity:

```php
#[ResolveEntity]
protected Calendar $calendar;

#[ResolveEntity(defaultCriteria: ['type' => CategoryType::UNCATEGORIZED])]
protected Category $category;
```

The `EntityTransformationHandler` reads this attribute and resolves the entity automatically.

## Validation

- Use `#[Assert\*]` constraints on Request DTO properties.
- Validate at the boundary (Request DTO), not inside controllers or services.

## Authorization (Voters)

Two voters cover domain permissions:

| Voter            | Subject    | Actions                                    |
|------------------|------------|--------------------------------------------|
| `CalendarVoter`  | `Calendar` | VIEW, ADD_EXPENSE, EDIT, DELETE            |
| `ExpenseVoter`   | `Expense`  | VIEW, EDIT, DELETE                         |

Always call `$this->denyAccessUnlessGranted(VoterClass::ACTION, $subject)` in controllers.

## Serialization Groups

`AbstractApiController::respond($data, groups: 'GROUP_NAME')` controls what is returned.

- Group constants live in `App\Const\ContextGroup\*ContextGroupConst`.
- Common groups: `ALWAYS` (always included), `DETAILS` (detail endpoints only).
- Prefer adding groups over returning ad-hoc arrays.

## Async Processing (Symfony Messenger)

Bulk operations dispatch messages to the bus:

```php
$bus->dispatch(new ImportExpenseMessage($expense));
```

`MessageHandler` classes process these asynchronously (supervised worker process in Docker).

## Conventions

- **Thin controllers**: move business logic to Services or Repositories.
- **Never read from `Request` directly** in controllers — use Request DTOs.
- **Always authorize** via Voters in controllers before touching data.
- **`declare(strict_types=1)`** at top of every PHP file.
- **PSR-4** autoloading (`App\` namespace).
- Attribute-based routing and mapping (no XML, no YAML for routes).

## Key Config Files

- `backend/composer.json` — dependencies
- `backend/.env` — DB, JWT, mailer, secrets
- `backend/config/routes.yaml` — loads routes from Controller attributes
- `backend/config/services.yaml` — DI config
- `backend/phpunit.xml.dist` — PHPUnit config
- `backend/phpstan.neon` — static analysis config
