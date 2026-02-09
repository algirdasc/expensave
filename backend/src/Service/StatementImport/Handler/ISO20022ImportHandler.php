<?php

declare(strict_types=1);

namespace App\Service\StatementImport\Handler;

use App\DTO\Statement\Import\ISO20022\Document;
use InvalidArgumentException;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\Serializer\Encoder\XmlEncoder;
use Symfony\Component\Serializer\Normalizer\AbstractObjectNormalizer;
use Symfony\Component\Serializer\SerializerInterface;

readonly class ISO20022ImportHandler implements StatementImportHandlerInterface
{
    private const ISO20022_XMLNS = 'urn:iso:std:iso:20022:tech:xsd:camt.053.001.02';

    /**
     * Hard limit to avoid pathological / DoS XML inputs.
     * ISO20022 statements are typically small; adjust if needed.
     */
    private const MAX_XML_BYTES = 5_000_000;

    public function __construct(
        private SerializerInterface $serializer
    ) {
    }

    public function supports(UploadedFile $file): bool
    {
        if (!in_array($file->getMimeType(), ['application/xml', 'text/xml'], true)) {
            return false;
        }

        try {
            $xml = $this->getSafeXmlContent($file);
        } catch (InvalidArgumentException) {
            return false;
        }

        // Avoid parsing untrusted XML just to detect the namespace.
        // camt.053.001.02 normally looks like: <Document xmlns="...">
        return (bool) preg_match('/\bxmlns\s*=\s*"' . preg_quote(self::ISO20022_XMLNS, '/') . '"/i', $xml);
    }

    public function process(UploadedFile $file): iterable
    {
        $xml = $this->getSafeXmlContent($file);

        /** @var Document $document */
        $document = $this->serializer->deserialize($xml, Document::class, XmlEncoder::FORMAT, [
            AbstractObjectNormalizer::DISABLE_TYPE_ENFORCEMENT => true,
        ]);

        foreach ($document->getBkToCstmrStmt()->getStmt() as $statement) {
            foreach ($statement->getNtry() as $entry) {
                $entry->setStmt($statement);

                yield $entry;
            }
        }
    }

    private function getSafeXmlContent(UploadedFile $file): string
    {
        $size = $file->getSize();
        if (is_int($size) && $size > self::MAX_XML_BYTES) {
            throw new InvalidArgumentException('XML file too large.');
        }

        $xml = $file->getContent();

        // Basic XXE / entity expansion hardening:
        // Reject any DOCTYPE/ENTITY usage (ISO20022 does not require it).
        // This is the simplest reliable guard that works regardless of libxml defaults.
        if (preg_match('/<!\s*(DOCTYPE|ENTITY)\b/i', $xml)) {
            throw new InvalidArgumentException('Unsafe XML: DOCTYPE/ENTITY is not allowed.');
        }

        // Also block common attempts to reference external systems.
        if (preg_match('/\b(SYSTEM|PUBLIC)\b/i', $xml)) {
            throw new InvalidArgumentException('Unsafe XML: external identifiers are not allowed.');
        }

        return $xml;
    }
}
