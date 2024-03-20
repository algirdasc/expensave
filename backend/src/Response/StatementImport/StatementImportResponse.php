<?php

declare(strict_types=1);

namespace App\Response\StatementImport;

use App\Const\ContextGroupConst;
use Symfony\Component\Serializer\Annotation\Groups;

readonly class StatementImportResponse
{
    /**
     * @param array<string, array<string>> $errors
     */
    public function __construct(
        private array $errors
    ) {

    }

    #[Groups(ContextGroupConst::API_ALL)]
    public function getErrors(): array
    {
        return $this->errors;
    }
}
