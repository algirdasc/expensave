<?php

declare(strict_types=1);

namespace App\Tests\Application\Service\StatementImport\Handler;

use App\Service\StatementImport\Handler\ISO20022ImportHandler;
use InvalidArgumentException;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\Serializer\SerializerInterface;

#[CoversClass(ISO20022ImportHandler::class)]
class ISO20022ImportHandlerTest extends TestCase
{
    /**
     * @return iterable<string, array{string}>
     */
    public static function supportedNamespaceProvider(): iterable
    {
        foreach (['02', '03', '04', '05', '06', '07', '08'] as $version) {
            yield "camt.053.001.$version" => ["urn:iso:std:iso:20022:tech:xsd:camt.053.001.$version"];
        }
    }

    #[DataProvider('supportedNamespaceProvider')]
    public function testSupportsAcceptsAllCamt053Versions(string $namespace): void
    {
        $handler = new ISO20022ImportHandler($this->createStub(SerializerInterface::class));

        $filePath = $this->writeTempFile("<?xml version=\"1.0\"?>\n<Document xmlns=\"$namespace\"></Document>");
        $uploadedFile = new UploadedFile($filePath, basename($filePath), 'application/xml', null, true);

        self::assertTrue($handler->supports($uploadedFile));
    }

    public function testSupportsReturnsFalseForUnsupportedNamespace(): void
    {
        $handler = new ISO20022ImportHandler($this->createStub(SerializerInterface::class));

        foreach (['camt.053.001.01', 'camt.053.001.09', 'camt.052.001.08'] as $message) {
            $filePath = $this->writeTempFile("<?xml version=\"1.0\"?>\n<Document xmlns=\"urn:iso:std:iso:20022:tech:xsd:$message\"></Document>");
            $uploadedFile = new UploadedFile($filePath, basename($filePath), 'application/xml', null, true);

            self::assertFalse($handler->supports($uploadedFile));
        }
    }

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
