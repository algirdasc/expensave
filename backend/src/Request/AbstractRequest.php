<?php

declare(strict_types=1);

namespace App\Request;

use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Mapping\MappingException;
use LogicException;
use ReflectionClass;
use ReflectionNamedType;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PropertyAccess\PropertyAccess;
use Symfony\Component\PropertyInfo\Extractor\PhpDocExtractor;
use Symfony\Component\Serializer\SerializerInterface;

abstract class AbstractRequest
{
    public function __construct(
        private readonly SerializerInterface $serializer
    ) {
        $this->populate();
    }

    public function getRequest(): Request
    {
        return Request::createFromGlobals();
    }

    protected function populate(): void
    {
        $propertyAccessor = PropertyAccess::createPropertyAccessor();
        $reflection = new ReflectionClass($this);

        $requestAsArray = $this->getRequest()->toArray();

        foreach ($reflection->getProperties() as $property) {
            $propertyName = $property->getName();
            $type = $property->getType();
            if ($type === null) {
                throw new LogicException(sprintf('Property "%s" must have type set', $propertyName));
            }

            $value = $requestAsArray[$propertyName] ?? null;

            if (!$type instanceof ReflectionNamedType) {
                throw new LogicException(sprintf('Property "%s" must have named type set', $propertyName));
            }

            $phpDocExtractor = new PhpDocExtractor();
            $types = $phpDocExtractor->getTypes(static::class, $propertyName);

            if (!$type->isBuiltin()) {
                $format = null;

                if ($types !== null) {
                    $format = $types[0]->getCollectionValueTypes()[0]->getClassName();
                }

                $value = $this->serializer->denormalize($value, $type->getName(), $format);
            } elseif ($type->getName() === 'array') {
//                $phpDocExtractor = new PhpDocExtractor();
//                $types = $phpDocExtractor->getTypes(static::class, $propertyName);
//                $collectionValueType = $types[0]->getCollectionValueTypes()[0];
//
//                if ($types !== null && $collectionValueType->getClassName() !== null) {
//                    $class = sprintf('%s[]', $collectionValueType->getClassName());
//                    $value = $this->serializer->denormalize($value, $class, 'something');
//                }
            } else {
                settype($value, $type->getName());
            }

            $propertyAccessor->setValue($this, $propertyName, $value);
        }
    }
}
