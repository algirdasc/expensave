<?php

declare(strict_types=1);

namespace App\Controller;

use App\Const\ContextGroupConst;
use App\Response\Error\ErrorResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Serializer\Encoder\JsonEncoder;

abstract class AbstractApiController extends AbstractController
{
    /**
     * @param array<string>|string $groups
     */
    public function respond(mixed $data, int $status = Response::HTTP_OK, array|string $groups = []): JsonResponse
    {
        $groups = (array) $groups;

        return $this
            ->json(
                data: $data,
                status: $status,
                context: [
                    'groups' => ContextGroupConst::fromRequest($groups),
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
        return JsonEncoder::FORMAT;
    }

    public function getDisallowedContentTypeError(): string
    {
        return 'Invalid JSON format';
    }
}
