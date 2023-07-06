<?php

declare(strict_types=1);

namespace App\Entity\Statement\Import\ISO20022;

use App\Entity\Statement\Import\ISO20022\Acct\Id;

class Acct
{
    private Id $id;

    public function getId(): Id
    {
        return $this->id;
    }

    public function setId(Id $id): self
    {
        $this->id = $id;

        return $this;
    }

    public function __toString(): string
    {
        return (string) $this->getId();
    }
}
