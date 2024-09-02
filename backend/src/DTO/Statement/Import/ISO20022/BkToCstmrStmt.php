<?php

declare(strict_types=1);

namespace App\DTO\Statement\Import\ISO20022;

/**
 * @codeCoverageIgnore
 */
class BkToCstmrStmt
{
    /**
     * @var array<Stmt>
     */
    private array $stmt = [];

    /**
     * @return array<Stmt>
     */
    public function getStmt(): array
    {
        return $this->stmt;
    }

    /**
     * @param array<Stmt> $stmt
     */
    public function setStmt(array $stmt): self
    {
        $this->stmt = $stmt;

        return $this;
    }
}
