<?php

declare(strict_types=1);

namespace App\Tests\Application\Service;

use App\Entity\Calendar;
use App\Entity\Category;
use App\Entity\Expense;
use App\Entity\RecurringExpense;
use App\Entity\User;
use App\Enum\RecurringExpenseFrequency;
use App\Enum\RecurringExpenseUpdateScope;
use App\Repository\ExpenseRepository;
use App\Repository\RecurringExpenseRepository;
use App\Request\Expense\UpdateExpenseRequest;
use App\Service\RecurringExpenseService;
use DateTime;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;
use Symfony\Component\HttpFoundation\RequestStack;

#[CoversClass(RecurringExpenseService::class)]
class RecurringExpenseServiceTest extends TestCase
{
    private RecurringExpenseRepository&MockObject $recurringExpenseRepository;
    private ExpenseRepository&MockObject $expenseRepository;
    private RecurringExpenseService $recurringExpenseService;

    protected function setUp(): void
    {
        $this->recurringExpenseRepository = $this->createMock(RecurringExpenseRepository::class);
        $this->expenseRepository = $this->createMock(ExpenseRepository::class);
        $this->recurringExpenseService = new RecurringExpenseService(
            $this->recurringExpenseRepository,
            $this->expenseRepository,
        );
    }

    public function testUpdateFromRequestUpdatesFutureOccurrencesAndShiftsDates(): void
    {
        $calendar = new Calendar('Calendar', new User());
        $category = new Category();
        $recurringExpense = $this->createRecurringExpense($calendar, $category);
        [$firstExpense, $secondExpense, $selectedExpense, $futureExpense] = $this->createExpenseSeries(
            $calendar,
            $category,
            $recurringExpense,
        );
        $updatedCategory = new Category();
        $request = $this->createUpdateRequest(
            calendar: $calendar,
            category: $updatedCategory,
            scope: RecurringExpenseUpdateScope::FUTURE,
        );
        $savedExpenses = [];

        $this->expenseRepository
            ->expects($this->once())
            ->method('findByRecurringExpenseAndUpdateScope')
            ->with($recurringExpense, $selectedExpense->getCreatedAt(), RecurringExpenseUpdateScope::FUTURE)
            ->willReturn([$selectedExpense, $futureExpense]);
        $this->expenseRepository
            ->expects($this->exactly(2))
            ->method('save')
            ->willReturnCallback(static function (Expense $expense) use (&$savedExpenses): void {
                $savedExpenses[] = $expense;
            });
        $this->recurringExpenseRepository->expects($this->never())->method('save');

        $this->recurringExpenseService->updateFromRequest($selectedExpense, $request);

        $this->assertSame([$selectedExpense, $futureExpense], $savedExpenses);
        $this->assertSame('2024-01-16 09:00:00', $selectedExpense->getCreatedAt()->format('Y-m-d H:i:s'));
        $this->assertSame('2024-01-23 09:00:00', $futureExpense->getCreatedAt()->format('Y-m-d H:i:s'));
        $this->assertSame('2024-01-01 09:00:00', $firstExpense->getCreatedAt()->format('Y-m-d H:i:s'));
        $this->assertSame('2024-01-08 09:00:00', $secondExpense->getCreatedAt()->format('Y-m-d H:i:s'));
        $this->assertSame('Updated rent', $selectedExpense->getLabel());
        $this->assertSame($updatedCategory, $futureExpense->getCategory());
    }

    public function testUpdateFromRequestUpdatesRecurringRuleWhenAllOccurrencesChange(): void
    {
        $calendar = new Calendar('Calendar', new User());
        $category = new Category();
        $recurringExpense = $this->createRecurringExpense($calendar, $category);
        $expenses = $this->createExpenseSeries($calendar, $category, $recurringExpense);
        $selectedExpense = $expenses[2];
        $updatedCategory = new Category();
        $request = $this->createUpdateRequest(
            calendar: $calendar,
            category: $updatedCategory,
            scope: RecurringExpenseUpdateScope::ALL,
        );

        $this->expenseRepository
            ->expects($this->once())
            ->method('findByRecurringExpenseAndUpdateScope')
            ->with($recurringExpense, $selectedExpense->getCreatedAt(), RecurringExpenseUpdateScope::ALL)
            ->willReturn($expenses);
        $this->expenseRepository->expects($this->exactly(4))->method('save');
        $this->recurringExpenseRepository
            ->expects($this->once())
            ->method('save')
            ->with($recurringExpense);

        $this->recurringExpenseService->updateFromRequest($selectedExpense, $request);

        $this->assertSame('2024-01-02 09:00:00', $expenses[0]->getCreatedAt()->format('Y-m-d H:i:s'));
        $this->assertSame('2024-01-09 09:00:00', $expenses[1]->getCreatedAt()->format('Y-m-d H:i:s'));
        $this->assertSame('2024-01-16 09:00:00', $expenses[2]->getCreatedAt()->format('Y-m-d H:i:s'));
        $this->assertSame('2024-01-23 09:00:00', $expenses[3]->getCreatedAt()->format('Y-m-d H:i:s'));
        $this->assertSame('2024-01-02 09:00:00', $recurringExpense->getStartsAt()->format('Y-m-d H:i:s'));
        $this->assertSame('Updated rent', $recurringExpense->getLabel());
        $this->assertSame($updatedCategory, $recurringExpense->getCategory());
    }

    public function testUpdateFromRequestConvertsSingleExpenseToRecurringSeries(): void
    {
        $calendar = new Calendar('Calendar', new User());
        $category = new Category();
        $user = new User();
        $expense = (new Expense())
            ->setCalendar($calendar)
            ->setCategory($category)
            ->setUser($user)
            ->setLabel('Rent')
            ->setAmount(-100)
            ->setCreatedAt(new DateTime('2024-01-01 09:00:00'))
            ->setConfirmed(true)
        ;
        $request = $this->createUpdateRequest(
            calendar: $calendar,
            category: $category,
            scope: RecurringExpenseUpdateScope::THIS,
        );
        $savedRecurringExpenses = [];
        $savedExpenses = [];

        $this->expenseRepository->expects($this->never())->method('findByRecurringExpenseAndUpdateScope');
        $this->recurringExpenseRepository
            ->expects($this->once())
            ->method('save')
            ->willReturnCallback(static function (RecurringExpense $recurringExpense) use (&$savedRecurringExpenses): void {
                $savedRecurringExpenses[] = $recurringExpense;
            });
        $this->expenseRepository
            ->expects($this->exactly(4))
            ->method('save')
            ->willReturnCallback(static function (Expense $expense) use (&$savedExpenses): void {
                $savedExpenses[] = $expense;
            });

        $result = $this->recurringExpenseService->updateFromRequest($expense, $request);

        $this->assertSame($expense, $result);
        $this->assertCount(1, $savedRecurringExpenses);
        $recurringExpense = $savedRecurringExpenses[0];
        $this->assertSame($recurringExpense, $expense->getRecurringExpense());
        $this->assertSame($user, $recurringExpense->getUser());
        $this->assertSame(RecurringExpenseFrequency::WEEKLY, $recurringExpense->getFrequency());
        $this->assertSame(4, $recurringExpense->getOccurrences());
        $this->assertSame('Updated rent', $recurringExpense->getLabel());
        $this->assertSame(-125.0, $recurringExpense->getAmount());
        $this->assertSame('2024-01-16 09:00:00', $recurringExpense->getStartsAt()->format('Y-m-d H:i:s'));

        $this->assertSame($expense, $savedExpenses[0]);
        $this->assertSame(
            [
                '2024-01-16 09:00:00',
                '2024-01-23 09:00:00',
                '2024-01-30 09:00:00',
                '2024-02-06 09:00:00',
            ],
            array_map(
                static fn (Expense $savedExpense): string => $savedExpense->getCreatedAt()->format('Y-m-d H:i:s'),
                $savedExpenses
            )
        );
        $this->assertSame($recurringExpense, $savedExpenses[3]->getRecurringExpense());
        $this->assertSame('Updated rent', $savedExpenses[3]->getLabel());
    }

    private function createRecurringExpense(Calendar $calendar, Category $category): RecurringExpense
    {
        return (new RecurringExpense())
            ->setCalendar($calendar)
            ->setCategory($category)
            ->setUser(new User())
            ->setFrequency(RecurringExpenseFrequency::WEEKLY)
            ->setOccurrences(4)
            ->setLabel('Rent')
            ->setAmount(-100)
            ->setConfirmed(true)
            ->setStartsAt(new DateTime('2024-01-01 09:00:00'))
        ;
    }

    /**
     * @return list<Expense>
     */
    private function createExpenseSeries(
        Calendar $calendar,
        Category $category,
        RecurringExpense $recurringExpense,
    ): array {
        return [
            $this->createExpense($calendar, $category, $recurringExpense, '2024-01-01 09:00:00'),
            $this->createExpense($calendar, $category, $recurringExpense, '2024-01-08 09:00:00'),
            $this->createExpense($calendar, $category, $recurringExpense, '2024-01-15 09:00:00'),
            $this->createExpense($calendar, $category, $recurringExpense, '2024-01-22 09:00:00'),
        ];
    }

    private function createExpense(
        Calendar $calendar,
        Category $category,
        RecurringExpense $recurringExpense,
        string $createdAt,
    ): Expense {
        return (new Expense())
            ->setCalendar($calendar)
            ->setCategory($category)
            ->setUser(new User())
            ->setRecurringExpense($recurringExpense)
            ->setLabel('Rent')
            ->setAmount(-100)
            ->setCreatedAt(new DateTime($createdAt))
            ->setConfirmed(true)
        ;
    }

    private function createUpdateRequest(
        Calendar $calendar,
        Category $category,
        RecurringExpenseUpdateScope $scope,
    ): UpdateExpenseRequest {
        $request = new UpdateExpenseRequest([], new RequestStack());
        $request->setCalendar($calendar);
        $request->setCategory($category);
        $request->setLabel('Updated rent');
        $request->setAmount(-125);
        $request->setCreatedAt(new DateTime('2024-01-16 09:00:00'));
        $request->setConfirmed(true);
        $request->setDescription('Updated description');
        $request->setRecurring(true);
        $request->setRecurringFrequency(RecurringExpenseFrequency::WEEKLY->value);
        $request->setRecurringOccurrences(4);
        $request->setRecurringUpdateScope($scope->value);

        return $request;
    }
}
