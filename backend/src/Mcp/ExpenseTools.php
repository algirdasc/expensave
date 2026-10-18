<?php

declare(strict_types=1);

namespace App\Mcp;

use App\Const\ContextGroup\ExpenseContextGroupConst;
use App\Entity\Category;
use App\Entity\Expense;
use App\Enum\CategoryType;
use App\Exception\RequestValidationException;
use App\Helper\DateHelper;
use App\Repository\CalendarRepository;
use App\Repository\CategoryRepository;
use App\Repository\ExpenseRepository;
use App\Request\AbstractRequest;
use App\Request\Expense\CreateExpenseRequest;
use App\Request\Expense\UpdateExpenseRequest;
use App\Security\UserContextProvider;
use App\Security\Voters\CalendarVoter;
use App\Security\Voters\ExpenseVoter;
use App\Service\RecurringExpenseService;
use App\Service\ValidationService;
use Mcp\Capability\Attribute\McpTool;
use Mcp\Capability\Attribute\Schema;
use Mcp\Exception\ToolCallException;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

final class ExpenseTools extends AbstractMcpTools
{
    public function __construct(
        Security $security,
        NormalizerInterface $normalizer,
        CalendarRepository $calendarRepository,
        CategoryRepository $categoryRepository,
        ExpenseRepository $expenseRepository,
        private readonly RecurringExpenseService $recurringExpenseService,
        private readonly ValidationService $validationService,
        private readonly UserContextProvider $userContextProvider,
    ) {
        parent::__construct($security, $normalizer, $calendarRepository, $categoryRepository, $expenseRepository);
    }

    /**
     * @return array<mixed>
     */
    #[McpTool(name: 'list-expenses', description: 'List expenses of a calendar within a date range, inclusive.')]
    public function listExpenses(
        #[Schema(description: 'Calendar ID')] int $calendarId,
        #[Schema(description: 'Range start, e.g. 2024-05-01 or 2024-05-01 10:00:00')] string $dateFrom,
        #[Schema(description: 'Range end, e.g. 2024-05-31 or 2024-05-31 23:59:59')] string $dateTo,
    ): array {
        $calendar = $this->findCalendarOrFail($calendarId);
        $this->denyAccessUnlessGranted(CalendarVoter::VIEW, $calendar);

        $dateFrom = $this->parseDate($dateFrom);
        $dateTo = $this->parseDate($dateTo);
        DateHelper::setRange($dateFrom, $dateTo);

        $expenses = $this->expenseRepository->findByCalendarsAndInterval([$calendar], $dateFrom, $dateTo);

        return $this->serialize($expenses, [ExpenseContextGroupConst::DETAILS]);
    }

    /**
     * @return array<mixed>
     */
    #[McpTool(name: 'get-expense', description: 'Get a single expense by ID.')]
    public function getExpense(
        #[Schema(description: 'Expense ID')] int $expenseId,
    ): array {
        $expense = $this->findExpenseOrFail($expenseId);
        $this->denyAccessUnlessGranted(ExpenseVoter::VIEW, $expense);

        return $this->serialize($expense, [ExpenseContextGroupConst::DETAILS]);
    }

    /**
     * @return array<mixed>
     */
    #[McpTool(name: 'add-expense', description: 'Add an expense to a calendar. Negative amounts are expenses, positive amounts are income.')]
    public function addExpense(
        #[Schema(description: 'Calendar ID')] int $calendarId,
        #[Schema(description: 'Expense label')] string $label,
        #[Schema(description: 'Amount, non-zero; negative for expenses, positive for income')] float $amount,
        #[Schema(description: 'Expense date, e.g. 2024-05-15 or 2024-05-15 15:30:00')] string $date,
        #[Schema(description: 'Category ID; defaults to the "Uncategorized" category')] ?int $categoryId = null,
        #[Schema(description: 'Optional description')] ?string $description = null,
        #[Schema(description: 'Whether the expense is confirmed (default: true)')] bool $confirmed = true,
    ): array {
        $calendar = $this->findCalendarOrFail($calendarId);
        $this->denyAccessUnlessGranted(CalendarVoter::ADD_EXPENSE, $calendar);

        $request = CreateExpenseRequest::blank()
            ->setCalendar($calendar)
            ->setCategory($categoryId !== null ? $this->findCategoryOrFail($categoryId) : $this->defaultCategory())
            ->setLabel($label)
            ->setAmount($amount)
            ->setCreatedAt($this->parseDate($date))
            ->setConfirmed($confirmed)
            ->setDescription($description);

        $this->validate($request);

        $expense = $this->recurringExpenseService->createFromRequest($this->userContextProvider->getUser(), $request);

        return $this->serialize($expense, [ExpenseContextGroupConst::DETAILS]);
    }

    /**
     * @return array<mixed>
     */
    #[McpTool(name: 'update-expense', description: 'Update an expense. Only given fields are changed; omitted fields keep their current values.')]
    public function updateExpense(
        #[Schema(description: 'Expense ID')] int $expenseId,
        #[Schema(description: 'Move the expense to another calendar ID')] ?int $calendarId = null,
        #[Schema(description: 'New label')] ?string $label = null,
        #[Schema(description: 'New amount, non-zero')] ?float $amount = null,
        #[Schema(description: 'New date, e.g. 2024-05-15 or 2024-05-15 15:30:00')] ?string $date = null,
        #[Schema(description: 'New category ID')] ?int $categoryId = null,
        #[Schema(description: 'New description')] ?string $description = null,
        #[Schema(description: 'New confirmed flag')] ?bool $confirmed = null,
    ): array {
        $expense = $this->findExpenseOrFail($expenseId);
        $this->denyAccessUnlessGranted(ExpenseVoter::EDIT, $expense);

        $calendar = $calendarId !== null ? $this->findCalendarOrFail($calendarId) : $expense->getCalendar();
        $this->denyAccessUnlessGranted(CalendarVoter::ADD_EXPENSE, $calendar);

        $request = UpdateExpenseRequest::blank();
        $request
            ->setCalendar($calendar)
            ->setCategory($categoryId !== null ? $this->findCategoryOrFail($categoryId) : $expense->getCategory())
            ->setLabel($label ?? $expense->getLabel())
            ->setAmount($amount ?? $expense->getAmount())
            ->setCreatedAt($date !== null ? $this->parseDate($date) : clone $expense->getCreatedAt())
            ->setConfirmed($confirmed ?? $expense->isConfirmed())
            ->setDescription($description ?? $expense->getDescription());

        $this->validate($request);

        $expense = $this->recurringExpenseService->updateFromRequest($expense, $request);

        return $this->serialize($expense, [ExpenseContextGroupConst::DETAILS]);
    }

    /**
     * @return array<string, bool|int>
     */
    #[McpTool(name: 'delete-expense', description: 'Delete an expense by ID.')]
    public function deleteExpense(
        #[Schema(description: 'Expense ID')] int $expenseId,
    ): array {
        $expense = $this->findExpenseOrFail($expenseId);
        $this->denyAccessUnlessGranted(ExpenseVoter::DELETE, $expense);

        $this->expenseRepository->remove($expense);

        return ['deleted' => true, 'expenseId' => $expenseId];
    }

    private function defaultCategory(): Category
    {
        return $this->categoryRepository->findOneBy(['type' => CategoryType::UNCATEGORIZED])
            ?? throw new ToolCallException('Default "Uncategorized" category not found.');
    }

    private function validate(AbstractRequest $request): void
    {
        try {
            $this->validationService->validateOrException($request);
        } catch (RequestValidationException $exception) {
            $messages = [];

            foreach ($exception->getValidationErrors() as $violation) {
                $messages[] = sprintf('%s: %s', $violation->getPropertyPath(), $violation->getMessage());
            }

            throw new ToolCallException(implode('; ', $messages));
        }
    }
}
