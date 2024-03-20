<?php

declare(strict_types=1);

namespace App\DTO\Statement\Import\ISO20022\Ntry;

use App\DTO\Statement\Import\ISO20022\Ntry\TxDtls\Refs;
use App\DTO\Statement\Import\ISO20022\Ntry\TxDtls\RltdPties;
use App\DTO\Statement\Import\ISO20022\Ntry\TxDtls\RmtInf;

class TxDtls
{
    private Refs $refs;
    private ?RltdPties $rltdPties = null;
    private RmtInf $rmtInf;

    public function getRefs(): Refs
    {
        return $this->refs;
    }

    public function setRefs(Refs $refs): self
    {
        $this->refs = $refs;

        return $this;
    }

    public function getRmtInf(): RmtInf
    {
        return $this->rmtInf;
    }

    public function setRmtInf(RmtInf $rmtInf): self
    {
        $this->rmtInf = $rmtInf;

        return $this;
    }

    public function getRltdPties(): ?RltdPties
    {
        return $this->rltdPties;
    }

    public function setRltdPties(?RltdPties $rltdPties): self
    {
        $this->rltdPties = $rltdPties;

        return $this;
    }
}
