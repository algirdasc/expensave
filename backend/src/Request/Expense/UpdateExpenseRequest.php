<?php

declare(strict_types=1);

namespace App\Request\Expense;

use App\Enum\RecurringExpenseUpdateScope;
use Symfony\Component\Validator\Constraints as Assert;

class UpdateExpenseRequest extends CreateExpenseRequest
{
    #[Assert\Choice(callback: [RecurringExpenseUpdateScope::class, 'values'])]
    protected ?string $recurringUpdateScope = null;

    public function getRecurringUpdateScope(): RecurringExpenseUpdateScope
    {
        return RecurringExpenseUpdateScope::from($this->recurringUpdateScope ?? RecurringExpenseUpdateScope::THIS->value);
    }

    public function setRecurringUpdateScope(?string $recurringUpdateScope): self
    {
        $this->recurringUpdateScope = $recurringUpdateScope ?? RecurringExpenseUpdateScope::THIS->value;

        return $this;
    }
}
