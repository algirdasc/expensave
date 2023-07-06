<?php

declare(strict_types=1);

namespace App\Response;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

abstract class AbstractResponse extends JsonResponse
{
    protected $statusCode = Response::HTTP_OK;
}