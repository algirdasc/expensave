<?php

declare(strict_types=1);

namespace App\DTO\Statement\Import\ISO20022\Ntry\TxDtls\RltdPties;

/**
 * @codeCoverageIgnore
 */
class Cdtr
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
