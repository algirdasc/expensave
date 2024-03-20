<?php

namespace App\DTO\Statement\Import\Revolut;

enum TypeEnum: string
{
    case TANSFER = 'TRANSFER';
    case CARD_PAYMENT = 'CARD_PAYMENT';
    case CARD_REFUND = 'CARD_REFUND';
    case TOPUP = 'TOPUP';
    case ATM = 'ATM';
    case EXCHANGE = 'EXCHANGE';
}
