<?php

declare(strict_types=1);

namespace App\DTO\Statement\Import\ISO20022;

class Prtry
{
    private string $cd;

    public function getCd(): string
    {
        return $this->cd;
    }

    public function setCd(string $cd): self
    {
        $this->cd = $cd;

        return $this;
    }
}
