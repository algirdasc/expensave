<?php

declare(strict_types=1);

namespace App\DTO\Statement\Import\ISO20022\Ntry\TxDtls;

use App\DTO\Statement\Import\ISO20022\Ntry\TxDtls\RltdPties\Cdtr;
use App\DTO\Statement\Import\ISO20022\Ntry\TxDtls\RltdPties\Dbtr;

/**
 * @codeCoverageIgnore
 */
class RltdPties
{
    private ?Cdtr $cdtr = null;
    private ?Dbtr $dbtr = null;

    public function getCdtr(): ?Cdtr
    {
        return $this->cdtr;
    }

    public function setCdtr(?Cdtr $cdtr): self
    {
        $this->cdtr = $cdtr;

        return $this;
    }

    public function getDbtr(): ?Dbtr
    {
        return $this->dbtr;
    }

    public function setDbtr(?Dbtr $dbtr): self
    {
        $this->dbtr = $dbtr;

        return $this;
    }
}
