<?php

namespace App\Handler\Request;

use App\Http\Request\AbstractRequest;
use ReflectionProperty;
use Symfony\Component\DependencyInjection\Attribute\AutoconfigureTag;

#[AutoconfigureTag('app.handler.request.transformation')]
interface TransformationHandlerInterface
{
    public function supportsProperty(ReflectionProperty $property): bool;

    public function transform(AbstractRequest $request, ReflectionProperty $property, mixed $value): mixed;
}