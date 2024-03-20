<?php

declare(strict_types=1);

namespace App\DTO\Statement\Import\ISO20022\Ntry\TxDtls;

use App\DTO\Statement\Import\ISO20022\Ntry\TxDtls\RmtInf\Strd;

class RmtInf
{
    private ?string $ustrd = null;
    private ?Strd $strd = null;

    public function getUstrd(): ?string
    {
        return $this->ustrd;
    }

    public function setUstrd(?string $ustrd): self
    {
        $this->ustrd = $ustrd;

        return $this;
    }

    public function getStrd(): ?Strd
    {
        return $this->strd;
    }

    public function setStrd(?Strd $strd): self
    {
        $this->strd = $strd;

        return $this;
    }

    public function __toString(): string
    {
        return (string) ($this->getUstrd() ?? $this->getStrd() ?? 'no remittance information provided');
    }
}
