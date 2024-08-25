<?php

declare(strict_types=1);

namespace App\Http\Response\StatementImport;

use App\Const\ContextGroupConst;
use App\Entity\Expense;
use Symfony\Component\Serializer\Annotation\Groups;

readonly class StatementImportResponse
{
    /**
     * @param array<Expense> $expenses
     */
    public function __construct(
        private array $expenses
    ) {
    }

    /**
     * @return array<Expense>
     */
    #[Groups(ContextGroupConst::API_ALL)]
    public function getExpenses(): array
    {
        return $this->expenses;
    }
}
