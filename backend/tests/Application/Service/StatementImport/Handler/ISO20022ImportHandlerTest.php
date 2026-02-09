<?php

declare(strict_types=1);

namespace App\Tests\Application\Service\StatementImport\Handler;

use App\Service\StatementImport\Handler\ISO20022ImportHandler;
use App\Tests\ApplicationTestCase;
use InvalidArgumentException;
use PHPUnit\Framework\Attributes\CoversClass;
use Symfony\Component\HttpFoundation\File\UploadedFile;

#[CoversClass(ISO20022ImportHandler::class)]
class ISO20022ImportHandlerTest extends ApplicationTestCase
{
    public function testSupportsReturnsFalseForUnsafeXmlWithDoctype(): void
    {
        /** @var ISO20022ImportHandler $handler */
        $handler = self::getContainer()->get(ISO20022ImportHandler::class);

        $filePath = $this->writeTempFile("<?xml version=\"1.0\"?>\n<!DOCTYPE foo [ <!ENTITY xxe SYSTEM \"file:///etc/passwd\"> ]>\n<Document xmlns=\"urn:iso:std:iso:20022:tech:xsd:camt.053.001.02\"></Document>");
        $uploadedFile = new UploadedFile($filePath, basename($filePath), 'application/xml', null, true);

        self::assertFalse($handler->supports($uploadedFile));
    }

    public function testProcessThrowsForUnsafeXmlWithDoctype(): void
    {
        /** @var ISO20022ImportHandler $handler */
        $handler = self::getContainer()->get(ISO20022ImportHandler::class);

        $filePath = $this->writeTempFile("<?xml version=\"1.0\"?>\n<!DOCTYPE foo [ <!ENTITY xxe SYSTEM \"file:///etc/passwd\"> ]>\n<Document xmlns=\"urn:iso:std:iso:20022:tech:xsd:camt.053.001.02\"></Document>");
        $uploadedFile = new UploadedFile($filePath, basename($filePath), 'application/xml', null, true);

        $this->expectException(InvalidArgumentException::class);

        iterator_to_array($handler->process($uploadedFile));
    }

    private function writeTempFile(string $contents): string
    {
        $path = tempnam(sys_get_temp_dir(), 'iso20022_');
        if ($path === false) {
            self::fail('Failed to create temp file.');
        }

        file_put_contents($path, $contents);

        return $path;
    }
}
