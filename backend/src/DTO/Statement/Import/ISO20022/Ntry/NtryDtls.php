<?php

declare(strict_types=1);

namespace App\DTO\Statement\Import\ISO20022\Ntry;

class NtryDtls
{
    /**
     * @var array<TxDtls>
     */
    private array $txDtls = [];

    /**
     * @return array<TxDtls>
     */
    public function getTxDtls(): array
    {
        return $this->txDtls;
    }

    /**
     * @param array<TxDtls> $txDtls
     */
    public function setTxDtls(array $txDtls): self
    {
        $this->txDtls = $txDtls;

        return $this;
    }

    public function getTxDetails(): ?TxDtls
    {
        return $this->getTxDtls()[0] ?? null;
    }
}
