<?php

declare(strict_types=1);

namespace App\DTO\Statement\Import\ISO20022\Acct;

/**
 * @codeCoverageIgnore
 */
class Othr
{
    private string $id;

    public function getId(): string
    {
        return $this->id;
    }

    public function setId(string $id): self
    {
        $this->id = $id;

        return $this;
    }
}
