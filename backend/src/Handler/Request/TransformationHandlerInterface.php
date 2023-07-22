<?php

namespace App\Handler\Request;

use App\Request\AbstractRequest;
use ReflectionProperty;

interface TransformationHandlerInterface
{
    public function supportsProperty(ReflectionProperty $property): bool;

    public function transform(AbstractRequest $request, ReflectionProperty $property, mixed $value): mixed;
}