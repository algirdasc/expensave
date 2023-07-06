<?php

declare(strict_types=1);

namespace App\Entity\Statement\Import\ISO20022\Ntry\TxDtls\RltdPties;

class Dbtr
{
    private string $nm;

    public function getNm(): string
    {
        return $this->nm;
    }

    public function setNm(string $nm): self
    {
        $this->nm = $nm;

        return $this;
    }

    public function __toString(): string
    {
        return $this->getNm();
    }
}
