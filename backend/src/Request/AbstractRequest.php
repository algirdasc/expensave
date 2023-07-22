<?php

declare(strict_types=1);

namespace App\Request;

use App\Attribute\Request\ResolveEntity;
use App\Resolver\Request\PopulationResolver;
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
        private SerializerInterface $serializer,
        private EntityManagerInterface $entityManager,
        private PopulationResolver $populationResolver
    ) {
        $this->populate();
    }

    public function getRequest(): Request
    {
        return Request::createFromGlobals();
    }

    protected function populate(): void
    {
        // TODO: use strategy to select value resolver
        $propertyAccessor = PropertyAccess::createPropertyAccessor();
        $reflection = new ReflectionClass($this);

        $requestAsArray = $this->getRequest()->toArray();

        foreach ($reflection->getProperties() as $property) {
            $propertyName = $property->getName();
            $type = $property->getType();

            if ($type === null) {
                throw new LogicException(sprintf('Property "%s" must have type set', $propertyName));
            }

            if (!$type instanceof ReflectionNamedType) {
                throw new LogicException(sprintf('Property "%s" must have named type set', $propertyName));
            }

            $value = $requestAsArray[$propertyName] ?? null;

            if (!$type->isBuiltin()) {
                $types = (new PhpDocExtractor())->getTypes(static::class, $propertyName);
                $collectionValueType = null;

                if ($types !== null) {
                    $collectionValueType = $types[0]->getCollectionValueTypes()[0]->getClassName();
                }

                $shouldResolveEntity = (bool) $property->getAttributes(ResolveEntity::class);
                if ($shouldResolveEntity && (is_int($value) || is_string($value))) {
                    $repository = $this->entityManager->getRepository($type->getName());
                    $value = $repository->find($value);
                }

                if (!$type->allowsNull() && null === $value) {
                    continue;
                }

                if (!$shouldResolveEntity) {
                    $value = $this->serializer->denormalize($value, $type->getName(), $collectionValueType);
                }
            } else {
                if ($type->allowsNull() && null === $value) {
                    continue;
                }

                settype($value, $type->getName());
            }

            $propertyAccessor->setValue($this, $propertyName, $value);
        }
    }
}
