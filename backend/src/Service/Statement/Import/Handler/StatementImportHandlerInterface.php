<?php

namespace App\Service\Statement\Import\Handler;

use App\Entity\Calendar;
use App\Entity\Expense;
use App\Entity\Statement\Import\StatementImportRowInterface;
use Symfony\Component\HttpFoundation\File\UploadedFile;

interface StatementImportHandlerInterface
{
    public function supports(UploadedFile $file): bool;

    /**
     * @return iterable<StatementImportRowInterface>
     */
    public function process(UploadedFile $file): iterable;
}