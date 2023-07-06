<?php

declare(strict_types=1);

namespace App\Entity\Statement\Import\ISO20022;

use DateTimeInterface;

class Stmt
{
    private Acct $acct;

    /**
     * @var array<Ntry>
     */
    private array $ntry = [];

    public function getAcct(): Acct
    {
        return $this->acct;
    }

    public function setAcct(Acct $acct): self
    {
        $this->acct = $acct;

        return $this;
    }

    /**
     * @return array<Ntry>
     */
    public function getNtry(): array
    {
        return $this->ntry;
    }

    /**
     * @param array<Ntry> $ntry
     */
    public function setNtry(array $ntry): self
    {
        $this->ntry = $ntry;

        return $this;
    }
}
