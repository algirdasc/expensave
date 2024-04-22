<?php

namespace App\DTO\Statement\Import\Revolut;

enum StateEnum: string
{
    case COMPLETED = 'COMPLETED';
    case REVERTED = 'REVERTED';
    case PENDING = 'PENDING';
}
