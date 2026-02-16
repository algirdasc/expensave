<?php

namespace App\Handler\Request;

use App\Request\AbstractRequest;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\EntityManagerInterface;
use ReflectionNamedType;
use ReflectionProperty;
use Symfony\Component\PropertyInfo\Extractor\PhpDocExtractor;

readonly class CollectionTransformationHandler implements TransformationHandlerInterface
{
    public function __construct(
        private EntityManagerInterface $entityManager
    ) {
    }

    public function supportsProperty(ReflectionProperty $property): bool
    {
        /** @var ReflectionNamedType $propertyType */
        $propertyType = $property->getType();

        return !$propertyType->isBuiltin() && $propertyType->getName() === Collection::class;
    }

    public function transform(AbstractRequest $request, ReflectionProperty $property, mixed $value): mixed
    {
        $allowsNull = $property->getType()?->allowsNull() ?? true;

        // Common case: field omitted from request body
        if ($value === null) {
            return $allowsNull ? null : new ArrayCollection();
        }

        // We only support transforming iterable inputs into a Doctrine collection.
        if (!is_array($value)) {
            return $allowsNull ? null : new ArrayCollection();
        }

        $collectionTypes = (new PhpDocExtractor())->getTypes($request::class, $property->getName());

        if ($collectionTypes === null) {
            return $allowsNull ? null : new ArrayCollection();
        }

        $valueTypes = $collectionTypes[0]->getCollectionValueTypes();
        $valueType = $valueTypes[0] ?? null;
        $entityClassName = $valueType?->getClassName();

        // If we cannot resolve the collection element class, do not blow up the request population
        if ($entityClassName === null || !class_exists($entityClassName)) {
            return $allowsNull ? null : new ArrayCollection();
        }

        /** @var class-string<object> $entityClassName */
        $classMetadata = $this->entityManager->getClassMetadata($entityClassName);
        $idField = $classMetadata->getSingleIdentifierFieldName();

        $repository = $this->entityManager->getRepository($entityClassName);

        $idValues = [];
        foreach ($value as $item) {
            $idValues[] = is_array($item) ? ($item[$idField] ?? null) : $item;
        }

        $idValues = array_values(array_filter($idValues, static fn (mixed $v): bool => $v !== null));

        if ($idValues === []) {
            return $allowsNull ? null : new ArrayCollection();
        }

        return new ArrayCollection($repository->findBy([$idField => $idValues]));
    }
}
