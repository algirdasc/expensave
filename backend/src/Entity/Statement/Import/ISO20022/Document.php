<?php

declare(strict_types=1);

namespace App\Entity\Statement\Import\ISO20022;

class Document
{
    private BkToCstmrStmt $bkToCstmrStmt;

    public function getBkToCstmrStmt(): BkToCstmrStmt
    {
        return $this->bkToCstmrStmt;
    }

    public function setBkToCstmrStmt(BkToCstmrStmt $bkToCstmrStmt): self
    {
        $this->bkToCstmrStmt = $bkToCstmrStmt;

        return $this;
    }
}
