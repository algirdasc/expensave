<?php

declare(strict_types=1);

namespace App\Mcp;

use App\Const\ContextGroupConst;
use App\Entity\Calendar;
use App\Entity\Category;
use App\Entity\Expense;
use App\Repository\CalendarRepository;
use App\Repository\CategoryRepository;
use App\Repository\ExpenseRepository;
use DateMalformedStringException;
use DateTime;
use Mcp\Exception\ToolCallException;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

abstract class AbstractMcpTools
{
    public function __construct(
        protected readonly Security $security,
        protected readonly NormalizerInterface $normalizer,
        protected readonly CalendarRepository $calendarRepository,
        protected readonly CategoryRepository $categoryRepository,
        protected readonly ExpenseRepository $expenseRepository,
    ) {
    }

    protected function findCalendarOrFail(int $calendarId): Calendar
    {
        return $this->calendarRepository->find($calendarId)
            ?? throw new ToolCallException(sprintf('Calendar #%d not found.', $calendarId));
    }

    protected function findCategoryOrFail(int $categoryId): Category
    {
        return $this->categoryRepository->find($categoryId)
            ?? throw new ToolCallException(sprintf('Category #%d not found.', $categoryId));
    }

    protected function findExpenseOrFail(int $expenseId): Expense
    {
        return $this->expenseRepository->find($expenseId)
            ?? throw new ToolCallException(sprintf('Expense #%d not found.', $expenseId));
    }

    protected function denyAccessUnlessGranted(string $attribute, Calendar|Category|Expense $subject): void
    {
        if (!$this->security->isGranted($attribute, $subject)) {
            throw new ToolCallException(sprintf('Access to %s #%d denied.', $subject::class, $subject->getId()));
        }
    }

    protected function parseDate(string $date): DateTime
    {
        try {
            return new DateTime($date);
        } catch (DateMalformedStringException) {
            throw new ToolCallException(sprintf('Invalid date "%s", expected "Y-m-d" or "Y-m-d H:i:s".', $date));
        }
    }

    /**
     * @param array<string> $groups
     *
     * @return array<mixed>
     */
    protected function serialize(mixed $data, array $groups = []): array
    {
        return (array) $this->normalizer->normalize($data, 'json', [
            'groups' => [...ContextGroupConst::API_ALL, ...$groups],
        ]);
    }
}
