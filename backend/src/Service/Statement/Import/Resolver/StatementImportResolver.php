<?php

declare(strict_types=1);

namespace App\Service\Statement\Import\Resolver;

use App\Service\Statement\Import\Handler\StatementImportHandlerInterface;
use RuntimeException;
use Symfony\Component\DependencyInjection\Attribute\TaggedIterator;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class StatementImportResolver
{
    /**
     * @var iterable<StatementImportHandlerInterface>
     */
    private iterable $importHandlers;

    /**
     * @param iterable<StatementImportHandlerInterface> $importHandlers
     */
    public function __construct(
        #[TaggedIterator('app.statement.import.handlers')] iterable $importHandlers
    ) {
        $this->importHandlers = $importHandlers;
    }

    public function getHandler(UploadedFile $uploadedFile): StatementImportHandlerInterface
    {
        foreach ($this->importHandlers as $importHandler) {
            if ($importHandler->supports($uploadedFile)) {
                return $importHandler;
            }
        }

        throw new RuntimeException('Supported handler for selected file not found.');
    }
}
