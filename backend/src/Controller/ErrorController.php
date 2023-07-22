<?php

declare(strict_types=1);

namespace App\Controller;

use App\Resolver\Error\ErrorResponseResolver;
use Symfony\Component\HttpFoundation\JsonResponse;
use Throwable;

class ErrorController extends AbstractApiController
{
    public function __invoke(Throwable $exception, ErrorResponseResolver $errorResponseResolver): JsonResponse
    {
        return $this->respondWithError($errorResponseResolver->getFromThrowable($exception));
    }
}
