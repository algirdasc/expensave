<?php

declare(strict_types=1);

namespace App\Service\StatementImport\Handler;

use App\DTO\Statement\Import\Revolut\ProductConst;
use App\DTO\Statement\Import\Revolut\RevolutStatementRow;
use App\DTO\Statement\Import\Revolut\TypeConst;
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

            $combined = array_combine($header, $data); // @phpstan-ignore-line
            foreach ($combined as &$data) {
                if ($data === '') {
                    $data = null;
                }
            }

            /** @var RevolutStatementRow $row */
            $row = $this->denormalizer->denormalize($combined, RevolutStatementRow::class);
            if ($row->getAmount() !== 0.0 && !$this->isTransactionIgnored($row)) {
                yield $row;
            }
        }
    }

    private function isTransactionIgnored(RevolutStatementRow $row): bool
    {
        /**
         * Ignore savings transfer, as it is on different account and can be impacted by different people.
         * TODO: Savings account import should be implemented separately from/to separate calendars
         *
         * TRANSFER    Savings    6/2/24 16:31    6/2/24 16:31    To EUR Holiday         0.42
         * TRANSFER    Savings    6/2/24 18:08    6/2/24 18:08    From XXXXX XXXXXXXX    0.48
         */
        if ($row->getProduct() === ProductConst::SAVINGS && $row->getType() === TypeConst::TRANSFER) {
            return true;
        }

        /**
         * Ignore deposit transfer, as they are just matching sums, e.g:
         *
         * TRANSFER    Deposit    8/7/23 11:52    8/7/24 12:04    xxxxxxxxxxxxxxxxxxxxxxxxx    100.00
         * TRANSFER    Deposit    8/7/23 11:52    8/7/24 12:04    From Flexible Cash Funds    -100.00
         */
        if ($row->getProduct() === ProductConst::DEPOSIT && $row->getType() === TypeConst::TRANSFER) {
            return true;
        }

        return false;
    }
}
