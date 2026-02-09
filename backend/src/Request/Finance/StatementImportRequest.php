<?php

declare(strict_types=1);

namespace App\Request\Finance;

use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\Validator\Constraints as Assert;

readonly class StatementImportRequest
{
    public function __construct(
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
        public ?UploadedFile $statement,
    ) {
    }
}
