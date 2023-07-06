<?php

declare(strict_types=1);

namespace App\Entity\Statement\Import\ISO20022\Ntry;

use DateTime;
use DateTimeInterface;

class BookgDt
{
    private ?DateTime $dt = null;
    private ?DateTime $dtTm = null;

    public function getDt(): ?DateTime
    {
        return $this->dt;
    }

    public function setDt(?DateTime $dt): self
    {
        $this->dt = $dt;

        return $this;
    }

    public function getDtTm(): ?DateTime
    {
        return $this->dtTm;
    }

    public function setDtTm(?DateTime $dtTm): self
    {
        $this->dtTm = $dtTm;

        return $this;
    }

    public function getDateTime(): ?DateTime
    {
        return $this->getDtTm() ?? $this->getDt();
    }
}
