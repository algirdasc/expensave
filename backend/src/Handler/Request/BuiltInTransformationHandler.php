<?php

namespace App\Handler\Request;

use App\Request\AbstractRequest;
use ReflectionNamedType;
use ReflectionProperty;
use Symfony\Component\PropertyInfo\Extractor\PhpDocExtractor;
use Symfony\Component\Serializer\Normalizer\DenormalizerInterface;
use Symfony\Component\TypeInfo\Type;
use Symfony\Component\TypeInfo\Type\CollectionType;
use Symfony\Component\TypeInfo\Type\CompositeTypeInterface;
use Symfony\Component\TypeInfo\Type\ObjectType;
use Symfony\Component\TypeInfo\Type\WrappingTypeInterface;

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
            $arrayType = (new PhpDocExtractor())->getType($request::class, $property->getName());

            if (null !== $arrayType && null !== $entityClassName = $this->getCollectionValueClassName($arrayType)) {
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

    /**
     * @return class-string|null
     */
    private function getCollectionValueClassName(Type $type): ?string
    {
        if ($type instanceof CollectionType) {
            return $this->getCollectionValueClassName($type->getCollectionValueType());
        }

        if ($type instanceof ObjectType) {
            $className = $type->getClassName();

            return class_exists($className) ? $className : null;
        }

        if ($type instanceof CompositeTypeInterface) {
            foreach ($type->getTypes() as $nestedType) {
                if (null !== $className = $this->getCollectionValueClassName($nestedType)) {
                    return $className;
                }
            }
        }

        if ($type instanceof WrappingTypeInterface) {
            return $this->getCollectionValueClassName($type->getWrappedType());
        }

        return null;
    }
}
