<?php

declare(strict_types=1);

namespace App\Response\StatementImport;

use App\Const\ContextGroupConst;
use Symfony\Component\Serializer\Annotation\Groups;

class StatementImportResponse
{
    /**
     * @var array<string, array<string>>
     */
    #[Groups(ContextGroupConst::API_ALL)]
    private array $errors = [];

    /**
     * @return array<string, array<string>>
     */
    public function getErrors(): array
    {
        return $this->errors;
    }

    /**
     * @param array<string, array<string>> $errors
     */
    public function setErrors(array $errors): self
    {
        $this->errors = $errors;

        return $this;
    }
}
