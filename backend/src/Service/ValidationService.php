<?php

declare(strict_types=1);

namespace App\Service;

use App\Exception\RequestValidationException;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class ValidationService
{
    public function __construct(
        private readonly ValidatorInterface $validator
    ) {
    }

    /**
     * @throws RequestValidationException
     */
    public function validateOrException(mixed $object): void
    {
        $violations = $this->validator->validate($object);

        if (!$violations->count()) {
            return;
        }

        throw new RequestValidationException($violations);
    }
}
