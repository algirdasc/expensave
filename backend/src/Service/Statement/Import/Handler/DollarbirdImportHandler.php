<?php

namespace App\Service\Statement\Import\Handler;

use App\DTO\Statement\Import\Dollarbird\DollarbirdStatementRow;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\Serializer\Encoder\CsvEncoder;
use Symfony\Component\Serializer\Normalizer\DenormalizerInterface;

readonly class DollarbirdImportHandler implements StatementImportHandlerInterface
{
    public function __construct(
        private DenormalizerInterface $denormalizer,
    ) {
    }

    public function supports(UploadedFile $file): bool
    {
        if ($file->getMimeType() !== 'text/csv') {
            return false;
        }

        $handle = fopen($file->getRealPath(), 'r');
        $firstLine = trim(fgets($handle));

        return $firstLine === 'Date,"Value","Label","Confirmed","Category","Description","Owner Name","Owner Email","Receipt"';
    }

    public function process(UploadedFile $file): iterable
    {
        $csvDecoder = new CsvEncoder();
        $decodedData = $csvDecoder->decode($file->getContent(), CsvEncoder::FORMAT);

        foreach ($decodedData as $data) {
            $row = $this->denormalizer->denormalize($data, DollarbirdStatementRow::class, CsvEncoder::FORMAT);

            yield $row;
        }
    }
}