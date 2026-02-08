<?php

declare(strict_types=1);

namespace App\Tests\Application\Service\StatementImport\Handler;

use App\Service\StatementImport\Handler\RevolutImportHandler;
use App\Tests\ApplicationTestCase;
use PHPUnit\Framework\Attributes\CoversClass;
use Symfony\Component\HttpFoundation\File\UploadedFile;

#[CoversClass(RevolutImportHandler::class)]
class RevolutImportHandlerTest extends ApplicationTestCase
{
    public function testProcessIgnoresSavingsTransferEvenWhenTypeIsNotUppercase(): void
    {
        /** @var RevolutImportHandler $handler */
        $handler = self::getContainer()->get(RevolutImportHandler::class);

        $filePath = self::getAssetFile('Files/StatementImport/account-statement_test_balance-transfer_and_savings_transfer.csv');
        $uploadedFile = new UploadedFile($filePath, basename($filePath), 'text/csv', null, true);

        $rows = iterator_to_array($handler->process($uploadedFile));

        // Balance Transfer (Current) should pass through.
        // Savings + Transfer should be ignored.
        self::assertCount(1, $rows);
        self::assertSame('Balance Transfer', $rows[0]->getType());
        self::assertSame('Current', $rows[0]->getProduct());
        self::assertSame(-0.2, $rows[0]->getAmount());
    }
}
