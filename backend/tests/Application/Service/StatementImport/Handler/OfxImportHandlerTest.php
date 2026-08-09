<?php

declare(strict_types=1);

namespace App\Tests\Application\Service\StatementImport\Handler;

use App\Service\StatementImport\Handler\OfxImportHandler;
use App\Service\StatementImport\Ofx\OfxParser;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\TestCase;
use Symfony\Component\HttpFoundation\File\UploadedFile;

#[CoversClass(OfxImportHandler::class)]
class OfxImportHandlerTest extends TestCase
{
    private OfxImportHandler $handler;

    protected function setUp(): void
    {
        $this->handler = new OfxImportHandler(new OfxParser());
    }

    public function testSupportsOfx1SgmlFile(): void
    {
        self::assertTrue($this->handler->supports($this->fixtureFile('ofx1_bank_statement.ofx')));
    }

    public function testSupportsOfx1CreditCardQfxFile(): void
    {
        self::assertTrue($this->handler->supports($this->fixtureFile('ofx1_credit_card.qfx')));
    }

    public function testSupportsOfx2XmlFile(): void
    {
        self::assertTrue($this->handler->supports($this->fixtureFile('ofx2_bank_statement.ofx')));
    }

    public function testSupportsRejectsNonOfxFiles(): void
    {
        $csvPath = __DIR__ . '/../../../../Files/StatementImport/account-statement_test_balance-transfer_and_savings_transfer.csv';
        self::assertFalse($this->handler->supports(new UploadedFile($csvPath, basename($csvPath), 'text/csv', null, true)));

        $camtPath = $this->writeTempFile('<?xml version="1.0"?><Document xmlns="urn:iso:std:iso:20022:tech:xsd:camt.053.001.02"></Document>');
        self::assertFalse($this->handler->supports(new UploadedFile($camtPath, basename($camtPath), 'application/xml', null, true)));

        $textPath = $this->writeTempFile('just some random text without ofx markers');
        self::assertFalse($this->handler->supports(new UploadedFile($textPath, basename($textPath), 'text/plain', null, true)));
    }

    public function testSupportsRejectsEmptyFile(): void
    {
        $emptyPath = $this->writeTempFile('');
        self::assertFalse($this->handler->supports(new UploadedFile($emptyPath, basename($emptyPath), 'text/plain', null, true)));
    }

    public function testProcessParsesOfx1BankStatement(): void
    {
        $rows = iterator_to_array($this->handler->process($this->fixtureFile('ofx1_bank_statement.ofx')));

        // The zero-amount transaction is skipped.
        self::assertCount(2, $rows);

        self::assertSame(-12.34, $rows[0]->getAmount());
        self::assertSame('Grocery Store', $rows[0]->getLabel());
        self::assertSame('Weekly groceries', $rows[0]->getDescription());
        self::assertSame('2024-08-02 09:55:13', $rows[0]->getCreatedAt()->format('Y-m-d H:i:s'));
        self::assertTrue($rows[0]->isConfirmed());
        self::assertNull($rows[0]->getCategoryName());

        self::assertSame(1500.0, $rows[1]->getAmount());
        self::assertSame('Employer Inc', $rows[1]->getLabel());
        // Fractional seconds and timezone bracket are stripped from DTPOSTED.
        self::assertSame('2024-08-15 10:00:00', $rows[1]->getCreatedAt()->format('Y-m-d H:i:s'));
    }

    public function testProcessParsesOfx1CreditCardQfx(): void
    {
        $rows = iterator_to_array($this->handler->process($this->fixtureFile('ofx1_credit_card.qfx')));

        self::assertCount(2, $rows);

        self::assertSame(-42.5, $rows[0]->getAmount());
        self::assertSame('Coffee Shop', $rows[0]->getLabel());
        self::assertNull($rows[0]->getDescription());

        // NAME is missing: MEMO becomes the label and is not duplicated as description.
        self::assertSame(-5.0, $rows[1]->getAmount());
        self::assertSame('Vending machine', $rows[1]->getLabel());
        self::assertNull($rows[1]->getDescription());
    }

    public function testProcessParsesOfx2Xml(): void
    {
        $rows = iterator_to_array($this->handler->process($this->fixtureFile('ofx2_bank_statement.ofx')));

        self::assertCount(1, $rows);
        self::assertSame(-7.99, $rows[0]->getAmount());
        self::assertSame('Streaming Service', $rows[0]->getLabel());
        self::assertSame('Monthly subscription', $rows[0]->getDescription());
        self::assertSame('2024-08-03 14:30:22', $rows[0]->getCreatedAt()->format('Y-m-d H:i:s'));
    }

    private function fixtureFile(string $filename): UploadedFile
    {
        $path = __DIR__ . '/../../../../Files/StatementImport/' . $filename;

        return new UploadedFile($path, $filename, null, null, true);
    }

    private function writeTempFile(string $contents): string
    {
        $path = tempnam(sys_get_temp_dir(), 'ofx_');
        if ($path === false) {
            self::fail('Failed to create temp file.');
        }

        file_put_contents($path, $contents);

        return $path;
    }
}
