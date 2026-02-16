<?php

namespace App\Handler\Request;

use App\Request\AbstractRequest;
use ReflectionNamedType;
use ReflectionProperty;
use Symfony\Component\HttpFoundation\File\UploadedFile;

readonly class UploadedFileTransformationHandler implements TransformationHandlerInterface
{
    public function supportsProperty(ReflectionProperty $property): bool
    {
        /** @var ReflectionNamedType $propertyType */
        $propertyType = $property->getType();

        return $propertyType->getName() === UploadedFile::class;
    }

    public function transform(AbstractRequest $request, ReflectionProperty $property, mixed $value): mixed
    {
        return $value;
    }
}