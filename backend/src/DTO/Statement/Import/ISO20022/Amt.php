<?php

declare(strict_types=1);

namespace App\DTO\Statement\Import\ISO20022;

use Symfony\Component\Serializer\Annotation\SerializedName;

/**
 * @codeCoverageIgnore
 */
class Amt
{
    #[SerializedName('@Ccy')]
    private string $ccy;

    #[SerializedName('#')]
    private float $amount;

    public function getCcy(): string
    {
        return $this->ccy;
    }

    public function setCcy(string $ccy): self
    {
        $this->ccy = $ccy;

        return $this;
    }

    public function getAmount(): float
    {
        return $this->amount;
    }

    public function setAmount(float|int $amount): self
    {
        $this->amount = (float) $amount;

        return $this;
    }
}
