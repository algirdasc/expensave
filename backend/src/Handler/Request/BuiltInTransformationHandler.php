<?php

namespace App\Handler\Request;

use App\Http\Request\AbstractRequest;
use ReflectionNamedType;
use ReflectionProperty;
use Symfony\Component\PropertyInfo\Extractor\PhpDocExtractor;
use Symfony\Component\Serializer\Normalizer\DenormalizerInterface;

readonly class BuiltInTransformationHandler implements TransformationHandlerInterface
{
    public function __construct(
        private DenormalizerInterface $denormalizer
    ) {
    }


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

        if ($propertyType->getName() === 'array') {
            $arrayType = (new PhpDocExtractor())->getTypes($request::class, $property->getName());

            if (null !== $arrayType) {
                /** @var class-string $entityClassName */
                $entityClassName = $arrayType[0]->getCollectionValueTypes()[0]->getClassName();

                $value = $this->denormalizer->denormalize($value, $entityClassName . '[]', context: ['disable_type_enforcement' => true]);
            }
        }

        settype($value, $propertyType->getName());

        return $value;
    }

    public static function getDefaultPriority(): int
    {
        return PHP_INT_MIN;
    }
}