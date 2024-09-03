<?php

declare(strict_types=1);

namespace App\Exception;

use App\Request\AbstractRequest;
use Exception;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Validator\ConstraintViolationListInterface;

/**
 * @codeCoverageIgnore
 */
class RequestValidationException extends Exception
{
    public function __construct(private readonly ConstraintViolationListInterface $violations)
    {
        $error = $violations->get(0);

        parent::__construct(
            sprintf('%s: %s', $error->getPropertyPath(), $error->getMessage()),
            Response::HTTP_UNPROCESSABLE_ENTITY
        );
    }

    public function getValidationErrors(): ConstraintViolationListInterface
    {
        return $this->violations;
    }
}
