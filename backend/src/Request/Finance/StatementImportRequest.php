<?php

declare(strict_types=1);

namespace App\Request\Finance;

use App\Request\AbstractRequest;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\Validator\Constraints as Assert;

class StatementImportRequest extends AbstractRequest
{
    #[Assert\NotNull(message: 'Statement file is required.')]
    #[Assert\File(
        maxSize: '5M',
        mimeTypes: [
            'application/xml',
            'text/xml',
            'text/csv',
            'application/csv',
            'application/vnd.ms-excel',
        ],
        mimeTypesMessage: 'Unsupported file type.'
    )]
    public UploadedFile $statement;

    public function getStatement(): UploadedFile
    {
        return $this->statement;
    }

    public function setStatement(UploadedFile $statement): self
    {
        $this->statement = $statement;

        return $this;
    }
}
