<?php

namespace App\DTO\Statement\Import\Revolut;

enum ProductEnum: string
{
    case SAVINGS = 'Savings';
    case CURRENT = 'Current';
}
