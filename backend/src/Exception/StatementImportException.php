<?php

declare(strict_types=1);

namespace App\Exception;

use Exception;
use JetBrains\PhpStorm\Pure;
use Throwable;

class StatementImportException extends Exception
{
    public function __construct(string $message, string $statementId, int $code = 0, ?Throwable $previous = null)
    {
        parent::__construct(sprintf('%s: %s', $statementId, $message), $code, $previous);
    }
}
