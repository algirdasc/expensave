<?php

namespace App\Handler\Request;

use App\Request\AbstractRequest;
use ReflectionNamedType;
use ReflectionProperty;

readonly class BuiltInTransformationHandler implements TransformationHandlerInterface
{
    public function supportsProperty(ReflectionProperty $property): bool
    {
        /** @var ReflectionNamedType $propertyType */
        $propertyType = $property->getType();

        return $propertyType->isBuiltin();
    }

    public function transform(AbstractRequest $request, ReflectionProperty $property, mixed $value): mixed
    {
        if ($property->getType()?->allowsNull() && null === $value) {
            return null;
        }

        /** @var ReflectionNamedType $propertyType */
        $propertyType = $property->getType();
        settype($value, $propertyType->getName());

        return $value;
    }

    public static function getDefaultPriority(): int
    {
        return -256;
    }
}