<?php

namespace App\DTO\Statement\Import\ISO20022\Ntry;

enum CdtDbtInd: string
{
    case DBIT = 'DBIT';
    case CRDT = 'CRDT';
}
