<?php

declare(strict_types=1);

namespace App\MessageHandler;

use App\Message\ImportMessage;
use App\Service\Statement\Import\ImporterService;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
readonly class ImportMessageHandler
{
    public function __construct(
        private ImporterService $importerService
    ) {
    }

    public function __invoke(ImportMessage $importMessage): void
    {
        $this->importerService->import($importMessage->getStatementRow(), $importMessage->getCalendar());
    }
}
