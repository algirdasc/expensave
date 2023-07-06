<?php

declare(strict_types=1);

namespace App\Controller;

use App\Const\ContextGroup\ExpenseContextGroupConst;
use App\Const\ContextGroupConst;
use App\Exception\RequestValidationException;
use App\Request\AbstractRequest;
use App\Response\Error\ErrorResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Validator\ConstraintViolationListInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Contracts\Service\Attribute\Required;

abstract class AbstractApiController extends AbstractController
{
    public function respond(mixed $data = null, array $groups = []): JsonResponse
    {
        return $this
            ->json(
                data: $data,
                context: [
                    'groups' => [ContextGroupConst::BASIC, ...$groups],
                ]
            )
            ->setEncodingOptions(JSON_PRETTY_PRINT)
            ;
    }

    public function respondWithError(ErrorResponse $error): JsonResponse
    {
        return $this
            ->json(
                data: $error,
                status: $error->getStatusCode(),
                context: [
                    'groups' => ContextGroupConst::API_ERROR,
                ]
            )
            ->setEncodingOptions(JSON_PRETTY_PRINT)
            ;
    }

    public function getAllowedContentTypeFormat(): string
    {
        return 'json';
    }

    public function getDisallowedContentTypeError(): string
    {
        return 'Invalid JSON';
    }
}
