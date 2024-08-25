<?php

declare(strict_types=1);

namespace App\Http\Request\Expense;

use App\Entity\Expense;
use App\Http\Request\AbstractRequest;

class ImportExpenseRequest extends AbstractRequest
{
    /**
     * @var array<Expense>
     */
    private array $expenses;

    /**
     * @return array<Expense>
     */
    public function getExpenses(): array
    {
        return $this->expenses;
    }

    /**
     * @param array<Expense> $expenses
     */
    public function setExpenses(array $expenses): self
    {
        $this->expenses = $expenses;

        return $this;
    }
}