# Skill: Data Model

Doctrine ORM entities live in `backend/src/Entity/`.

## Entity Overview

```
User
 └── owns many → Calendar
 └── collaborates on many → Calendar (via CalendarCollaborator join)

Calendar
 └── has many → Expense
 └── has many → CategoryRule

Expense
 └── belongs to → Calendar
 └── belongs to → User (who created it)
 └── belongs to → Category

Category
 └── can be system-wide or user-specific

CategoryRule
 └── belongs to → Calendar
 └── auto-assigns Category to imported expenses

RefreshToken  (JWT refresh token storage)
```

## Entity Details

### User

| Property         | Type     | Notes                                         |
|------------------|----------|-----------------------------------------------|
| id               | int      | Auto-increment                                |
| email            | string   | Unique; used as username                      |
| name             | string   |                                               |
| password         | string   | Hashed                                        |
| active           | bool     |                                               |
| defaultCalendarId| int|null | FK to Calendar                                |
| calendars        | Collection | Calendars owned by this user               |
| sharedCalendars  | Collection | Calendars shared with this user            |

Implements `UserInterface` (Symfony Security).

### Calendar

| Property      | Type       | Notes                                            |
|---------------|------------|--------------------------------------------------|
| id            | int        |                                                  |
| name          | string     |                                                  |
| owner         | User       | ManyToOne                                        |
| collaborators | Collection | ManyToMany with User via join table              |
| balance       | float|null | Computed balance                                 |
| expenses      | Collection | OneToMany → Expense                              |
| categoryRules | Collection | OneToMany → CategoryRule                         |

Permissions on calendars: VIEW, ADD_EXPENSE, EDIT, DELETE (`CalendarVoter`).

### Expense

| Property    | Type       | Notes                                                |
|-------------|------------|------------------------------------------------------|
| id          | int        |                                                      |
| label       | string     | Description / name of the expense                    |
| amount      | float      | **Negative = expense, Positive = income**            |
| createdAt   | DateTimeImmutable |                                               |
| calendar    | Calendar   | ManyToOne                                            |
| user        | User       | ManyToOne (who created it)                           |
| category    | Category   | ManyToOne                                            |
| confirmed   | bool       | Whether the expense is confirmed                     |
| description | string|null | Optional longer note                                |

### Category

| Property | Type         | Notes                                               |
|----------|--------------|-----------------------------------------------------|
| id       | int          |                                                     |
| name     | string       |                                                     |
| shared   | bool         | System-wide (true) or user-specific (false)         |
| type     | CategoryType | Enum: UNCATEGORIZED, INCOME, EXPENSE, CUSTOM        |
| user     | User|null    | Null for system categories                          |

### CategoryRule

| Property   | Type     | Notes                                              |
|------------|----------|----------------------------------------------------|
| id         | int      |                                                    |
| calendar   | Calendar | ManyToOne                                          |
| pattern    | string   | Match pattern for expense label                    |
| category   | Category | Category to assign when pattern matches            |

### RefreshToken

Managed by `gesdinet/jwt-refresh-token-bundle`. Stores JWT refresh tokens for users.

## Key Business Rules

- **Amount sign convention**: always negative for outgoing expenses, positive for income. This is enforced at the frontend when creating expenses.
- **Calendar ownership**: only the owner can edit/delete a calendar. Collaborators can view and add expenses (based on their permission level).
- **Category resolution**: if no category provided on expense creation, the system falls back to the `UNCATEGORIZED` category via `#[ResolveEntity(defaultCriteria: ['type' => CategoryType::UNCATEGORIZED])]`.
- **Import flow**: bank statements are parsed into `Expense` objects, then auto-categorized via `CategoryRule` patterns before being persisted asynchronously via Symfony Messenger.

## Frontend Data Models

Mirrored in `frontend/src/app/api/objects/`:
- `Expense`, `Calendar`, `Category`, `User`, `BalanceMeta`, `CategoryBalance`, `ExpenseBalance`
- Deserialized using `class-transformer` from JSON API responses.
