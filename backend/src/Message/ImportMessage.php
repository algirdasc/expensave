<?php

declare(strict_types=1);

namespace App\Message;

use App\DTO\Statement\Import\StatementImportRowInterface;
use App\Entity\Calendar;

readonly class ImportMessage
{
    public function __construct(
        private Calendar $calendar,
        private StatementImportRowInterface $statementRow
    ) {
    }

    public function getCalendar(): Calendar
    {
        return $this->calendar;
    }

    public function getStatementRow(): StatementImportRowInterface
    {
        return $this->statementRow;
    }
}