<?php

namespace App\Handler\Request;

use App\Request\AbstractRequest;
use ReflectionProperty;

class BuiltInTransformationHandler implements TransformationHandlerInterface
{
    public function supportsProperty(ReflectionProperty $property): bool
    {
        return $property->getType()?->isBuiltin();
    }

    public function transform(AbstractRequest $request, ReflectionProperty $property, mixed $value): mixed
    {
        if ($property->getType()?->allowsNull() && null === $value) {
            return null;
        }

        settype($value, $property->getType()?->getName());

        return $value;
    }

    public static function getDefaultPriority(): int
    {
        return -256;
    }
}