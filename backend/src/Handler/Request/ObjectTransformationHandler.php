<?php

namespace App\Handler\Request;

use App\Request\AbstractRequest;
use ReflectionProperty;
use Symfony\Component\Serializer\SerializerInterface;

readonly class ObjectTransformationHandler implements TransformationHandlerInterface
{
    public function __construct(
        private SerializerInterface $serializer
    ) {
    }

    public function supportsProperty(ReflectionProperty $property): bool
    {
        return !$property->getType()?->isBuiltin();
    }

    public function transform(AbstractRequest $request, ReflectionProperty $property, mixed $value): mixed
    {
        return $this->serializer->denormalize($value, $property->getType()?->getName());
    }

    public static function getDefaultPriority(): int
    {
        return -256;
    }
}