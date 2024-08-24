<?php

declare(strict_types=1);

namespace App\Message;

use App\Entity\Expense;

readonly class ImportExpenseMessage
{
    public function __construct(
        private int $userId,
        private int $calendarId,
        private int $categoryId,
        private Expense $expense,
    ) {
    }

    public function getUserId(): int
    {
        return $this->userId;
    }

    public function getCalendarId(): int
    {
        return $this->calendarId;
    }

    public function getCategoryId(): int
    {
        return $this->categoryId;
    }

    public function getExpense(): Expense
    {
        return $this->expense;
    }
}