<?php

declare(strict_types=1);

namespace App\Service\StatementImport\Handler;

use App\DTO\Statement\Import\Ofx\OfxStatementRow;
use App\Service\StatementImport\Ofx\OfxParser;
use InvalidArgumentException;
use Symfony\Component\HttpFoundation\File\UploadedFile;

/**
 * Imports OFX 1.x/2.x and QFX bank statement files (common for US banks:
 * Chase, Bank of America, Wells Fargo, Citi, Amex, ...).
 *
 * Detection is content-based (OFXHEADER preamble or <OFX> root tag) because
 * browsers report .ofx/.qfx files with inconsistent MIME types (usually
 * text/plain or application/octet-stream).
 */
readonly class OfxImportHandler implements StatementImportHandlerInterface
{
    private const MAX_BYTES = 5_000_000;

    public function __construct(
        private OfxParser $parser
    ) {
    }

    public function supports(UploadedFile $file): bool
    {
        if ($this->exceedsSizeLimit($file)) {
            return false;
        }

        $head = file_get_contents($file->getRealPath(), false, null, 0, 4096);
        if ($head === false) {
            return false;
        }

        return $this->parser->supports($head);
    }

    public function process(UploadedFile $file): iterable
    {
        if ($this->exceedsSizeLimit($file)) {
            throw new InvalidArgumentException('OFX file exceeds the size limit.');
        }

        foreach ($this->parser->parseTransactions($file->getContent()) as $transaction) {
            $row = OfxStatementRow::fromTransaction($transaction);

            if ($row->getAmount() !== 0.0) {
                yield $row;
            }
        }
    }

    private function exceedsSizeLimit(UploadedFile $file): bool
    {
        $size = $file->getSize();

        return !is_int($size) || $size > self::MAX_BYTES;
    }
}
