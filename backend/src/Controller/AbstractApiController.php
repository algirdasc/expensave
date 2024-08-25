<?php

declare(strict_types=1);

namespace App\Controller;

use App\Const\ContextGroupConst;
use App\Http\Response\Error\ErrorResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

abstract class AbstractApiController extends AbstractController
{
    /**
     * @param array<string>|string $groups
     */
    public function respond(mixed $data, int $status = Response::HTTP_OK, array|string $groups = []): JsonResponse
    {
        $groups = (array) $groups;

        /**
         * @noinspection PhpUnhandledExceptionInspection
         * @var NormalizerInterface $normalizer
         */
        $normalizer = $this->container->get('serializer');

        return $this
            ->json(
                data: $data,
                status: $status,
                context: [
                    'groups' => ContextGroupConst::fromRequest($groups),
                    AbstractNormalizer::CIRCULAR_REFERENCE_HANDLER => function (object $object, string $format, array $context) use ($normalizer): array {
                        return (array) $normalizer->normalize($object, $format, ['groups' => ContextGroupConst::fromRequest()]);
                    }
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
