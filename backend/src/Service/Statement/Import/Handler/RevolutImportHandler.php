<?php

declare(strict_types=1);

namespace App\Service\Statement\Import\Handler;

use App\DTO\Statement\Import\Revolut\ProductEnum;
use App\DTO\Statement\Import\Revolut\RevolutStatementRow;
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
        return str_starts_with($file->getClientOriginalName(), 'account-statement_') && $file->getMimeType() === 'text/csv';
    }

    public function process(UploadedFile $file): iterable
    {
        $handle = fopen($file->getRealPath(), 'r');
        if ($handle === false) {
            return;
        }

        $header = null;
        while (($data = fgetcsv($handle)) !== false) {
            if ($header === null) {
                $header = $data;
                continue;
            }

            $combined = array_combine($header, $data);
            foreach ($combined as &$data) {
                if ($data === '') {
                    $data = null;
                }
            }

            /** @var RevolutStatementRow $row */
            $row = $this->denormalizer->denormalize($combined, RevolutStatementRow::class);
            if ($row->getAmount() !== 0.0 && $row->getProduct() === ProductEnum::CURRENT) {
                yield $row;
            }
        }
    }
}
