<?php

declare(strict_types=1);

namespace App\Exception;

use Symfony\Component\HttpKernel\Exception\UnsupportedMediaTypeHttpException;

class UnsupportedStatementFileException extends UnsupportedMediaTypeHttpException
{
    public function __construct()
    {
        parent::__construct('Selected bank statement file is not supported');
    }
}
