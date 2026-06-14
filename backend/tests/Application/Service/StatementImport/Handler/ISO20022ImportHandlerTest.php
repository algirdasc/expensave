<?php

declare(strict_types=1);

namespace App\Tests\Application\Service\StatementImport\Handler;

use App\Service\StatementImport\Handler\ISO20022ImportHandler;
use InvalidArgumentException;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\TestCase;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\Serializer\SerializerInterface;

#[CoversClass(ISO20022ImportHandler::class)]
class ISO20022ImportHandlerTest extends TestCase
{
    public function testSupportsReturnsFalseForUnsafeXmlWithDoctype(): void
    {
        $serializer = $this->createMock(SerializerInterface::class);
        $serializer
            ->expects($this->never())
            ->method('deserialize');
        $handler = new ISO20022ImportHandler($serializer);

        $filePath = $this->writeTempFile("<?xml version=\"1.0\"?>\n<!DOCTYPE foo [ <!ENTITY xxe SYSTEM \"file:///etc/passwd\"> ]>\n<Document xmlns=\"urn:iso:std:iso:20022:tech:xsd:camt.053.001.02\"></Document>");
        $uploadedFile = new UploadedFile($filePath, basename($filePath), 'application/xml', null, true);

        self::assertFalse($handler->supports($uploadedFile));
    }

    public function testProcessThrowsForUnsafeXmlWithDoctype(): void
    {
        $serializer = $this->createMock(SerializerInterface::class);
        $serializer
            ->expects($this->never())
            ->method('deserialize');
        $handler = new ISO20022ImportHandler($serializer);

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
