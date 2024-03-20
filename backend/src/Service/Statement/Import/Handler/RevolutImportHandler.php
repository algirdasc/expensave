<?php

declare(strict_types=1);

namespace App\Service\Statement\Import\Handler;

use App\DTO\Statement\Import\Revolut\RevolutStatementRow;
use PhpOffice\PhpSpreadsheet\IOFactory;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\Serializer\Normalizer\DenormalizerInterface;

readonly class RevolutImportHandler implements StatementImportHandlerInterface
{
    public function __construct(
        private DenormalizerInterface $denormalizer
    ) {
    }

    public function supports(UploadedFile $file): bool
    {
        return str_starts_with($file->getClientOriginalName(), 'account-statement_')
            && $file->getMimeType() === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    }

    public function process(UploadedFile $file): iterable
    {
        $reader = IOFactory::createReader(IOFactory::READER_XLSX);
        $spreadsheet = $reader->load($file->getRealPath());

        $headers = [];

        foreach ($spreadsheet->getActiveSheet()->toArray() as $idx => $line) {
            if ($idx === 0) {
                $headers = $line;

                continue;
            }

            $combined = array_combine($headers, $line);

            /** @var RevolutStatementRow $row */
            $row = $this->denormalizer->denormalize($combined, RevolutStatementRow::class);
            if ($row->getAmount() !== 0.0) {
                yield $row;
            }
        }
    }
}
