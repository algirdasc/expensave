<?php

namespace App\Handler\Request;

use App\Request\AbstractRequest;
use ReflectionNamedType;
use ReflectionProperty;
use Symfony\Component\Serializer\Normalizer\DenormalizerInterface;

readonly class ObjectTransformationHandler implements TransformationHandlerInterface
{
    public function __construct(
        private DenormalizerInterface $denormalizer
    ) {
    }

    public function supportsProperty(ReflectionProperty $property): bool
    {
        /** @var ReflectionNamedType $propertyType */
        $propertyType = $property->getType();

        return !$propertyType->isBuiltin();
    }

    public function transform(AbstractRequest $request, ReflectionProperty $property, mixed $value): mixed
    {
        /** @var ReflectionNamedType $propertyType */
        $propertyType = $property->getType();

        return $this->denormalizer->denormalize($value, $propertyType->getName());
    }

    public static function getDefaultPriority(): int
    {
        return -256;
    }
}