<?php

declare(strict_types=1);

namespace App\Service\StatementImport\Resolver;

use App\Service\StatementImport\Handler\StatementImportHandlerInterface;
use RuntimeException;
use Symfony\Component\DependencyInjection\Attribute\AutowireIterator;
use Symfony\Component\HttpFoundation\File\UploadedFile;

readonly class StatementImportResolver
{
    /**
     * @param iterable<StatementImportHandlerInterface> $importHandlers
     */
    public function __construct(
        #[AutowireIterator('app.statement.import.handler')] private iterable $importHandlers
    ) {
    }

    public function getHandler(UploadedFile $uploadedFile): StatementImportHandlerInterface
    {
        foreach ($this->importHandlers as $importHandler) {
            if ($importHandler->supports($uploadedFile)) {
                return $importHandler;
            }
        }

        throw new RuntimeException('Selected bank statement file is not supported');
    }
}
