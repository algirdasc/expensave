<?php

declare(strict_types=1);

namespace App\DTO\Statement\Import\ISO20022\Acct;

/**
 * @codeCoverageIgnore
 */
class Id
{
    private ?string $iban = null;
    private ?Othr $oth = null;

    public function getIban(): ?string
    {
        return $this->iban;
    }

    public function setIban(?string $iban): self
    {
        $this->iban = $iban;

        return $this;
    }

    public function getOth(): ?Othr
    {
        return $this->oth;
    }

    public function setOth(?Othr $oth): self
    {
        $this->oth = $oth;

        return $this;
    }

    public function __toString(): string
    {
        return (string) ($this->getIban() ?? $this->getOth()?->getId());
    }
}
