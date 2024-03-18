<?php

namespace App\Service\Statement\Import\Handler;

use App\Entity\Calendar;
use App\Entity\Expense;
use App\Entity\Statement\Import\StatementImportRowInterface;
use Symfony\Component\DependencyInjection\Attribute\AsTaggedItem;
use Symfony\Component\HttpFoundation\File\UploadedFile;

#[AsTaggedItem('app.statement.import.handler')]
interface StatementImportHandlerInterface
{
    public function supports(UploadedFile $file): bool;

    /**
     * @return iterable<StatementImportRowInterface>
     */
    public function process(UploadedFile $file): iterable;
}