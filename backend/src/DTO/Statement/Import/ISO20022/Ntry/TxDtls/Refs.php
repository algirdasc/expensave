<?php

declare(strict_types=1);

namespace App\DTO\Statement\Import\ISO20022\Ntry\TxDtls;

class Refs
{
    private ?string $acctSvcrRef = null;
    private ?string $instrId = null;
    private ?string $endToEndId = null;
    private ?string $txId = null;

    public function getAcctSvcrRef(): ?string
    {
        return $this->acctSvcrRef;
    }

    public function setAcctSvcrRef(?string $acctSvcrRef): self
    {
        $this->acctSvcrRef = $acctSvcrRef;

        return $this;
    }

    public function getInstrId(): ?string
    {
        return $this->instrId;
    }

    public function setInstrId(?string $instrId): self
    {
        $this->instrId = $instrId;

        return $this;
    }

    public function getEndToEndId(): ?string
    {
        return $this->endToEndId;
    }

    public function setEndToEndId(?string $endToEndId): self
    {
        $this->endToEndId = $endToEndId;

        return $this;
    }

    public function getTxId(): ?string
    {
        return $this->txId;
    }

    public function setTxId(?string $txId): self
    {
        $this->txId = $txId;

        return $this;
    }
}
