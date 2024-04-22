<?php

namespace App\Handler\Request;

use App\Attribute\Request\ResolveEntity;
use App\Request\AbstractRequest;
use Doctrine\ORM\EntityManagerInterface;
use ReflectionNamedType;
use ReflectionProperty;

readonly class EntityTransformationHandler implements TransformationHandlerInterface
{
    public function __construct(
        private EntityManagerInterface $entityManager
    ) {
    }

    public function supportsProperty(ReflectionProperty $property): bool
    {
        /** @var ReflectionNamedType $propertyType */
        $propertyType = $property->getType();

        return !$propertyType->isBuiltin() && $property->getAttributes(ResolveEntity::class);
    }

    public function transform(AbstractRequest $request, ReflectionProperty $property, mixed $value): mixed
    {
        /** @var ReflectionNamedType $propertyType */
        $propertyType = $property->getType();

        /** @var class-string $entityClassName */
        $entityClassName = $propertyType->getName();
        $classMetadata = $this->entityManager->getClassMetadata($entityClassName);
        $idField = $classMetadata->getSingleIdentifierFieldName();

        if (is_array($value)) {
            $value = $value[$idField] ?? null;
        }

        if (null === $value) {
            return null;
        }

        $repository = $this->entityManager->getRepository($entityClassName);

        return $repository->find($value);
    }
}