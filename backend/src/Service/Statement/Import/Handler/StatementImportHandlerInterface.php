<?php

namespace App\Service\Statement\Import\Handler;

use App\DTO\Statement\Import\StatementImportRowInterface;
use Symfony\Component\DependencyInjection\Attribute\AutoconfigureTag;
use Symfony\Component\HttpFoundation\File\UploadedFile;

#[AutoconfigureTag('app.statement.import.handler')]
interface StatementImportHandlerInterface
{
    public function supports(UploadedFile $file): bool;

    /**
     * @return iterable<StatementImportRowInterface>
     */
    public function process(UploadedFile $file): iterable;
}