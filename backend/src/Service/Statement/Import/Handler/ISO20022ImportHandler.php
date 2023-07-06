<?php

declare(strict_types=1);

namespace App\Service\Statement\Import\Handler;

use App\Entity\Statement\Import\ISO20022\Document;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\Serializer\Encoder\XmlEncoder;
use Symfony\Component\Serializer\Normalizer\AbstractObjectNormalizer;
use Symfony\Component\Serializer\SerializerInterface;

class ISO20022ImportHandler implements StatementImportHandlerInterface
{
    public function __construct(
        private readonly SerializerInterface $serializer
    ) {
    }

    public function supports(UploadedFile $file): bool
    {
        if (in_array($file->getMimeType(), ['application/xml', 'text/xml'], true)) {
            $encoder = new XmlEncoder();
            $a = $encoder->decode($file->getContent(), XmlEncoder::FORMAT);

            return ($a['@xmlns'] ?? '') === 'urn:iso:std:iso:20022:tech:xsd:camt.053.001.02';
        }

        return false;
    }

    public function process(UploadedFile $file): iterable
    {
        /** @var Document $document */
        $document = $this->serializer->deserialize($file->getContent(), Document::class, XmlEncoder::FORMAT, [
            AbstractObjectNormalizer::DISABLE_TYPE_ENFORCEMENT => true,
        ]);

        foreach ($document->getBkToCstmrStmt()->getStmt() as $statement) {
            foreach ($statement->getNtry() as $entry) {
                $entry->setStmt($statement);

                yield $entry;
            }
        }
    }
}
