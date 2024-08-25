<?php

namespace App\Handler\Request;

use App\Http\Request\AbstractRequest;
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

        return !$propertyType->isBuiltin() && Collection::class === $propertyType->getName();
    }

    public function transform(AbstractRequest $request, ReflectionProperty $property, mixed $value): mixed
    {
        $collectionTypes = (new PhpDocExtractor())->getTypes($request::class, $property->getName());

        if (null === $collectionTypes) {
            return $value;
        }

        /** @var class-string $entityClassName */
        $entityClassName = $collectionTypes[0]->getCollectionValueTypes()[0]->getClassName();
        $classMetadata = $this->entityManager->getClassMetadata($entityClassName);
        $idField = $classMetadata->getSingleIdentifierFieldName();

        $repository = $this->entityManager->getRepository($entityClassName);

        $idValues = [];
        foreach ($value ?? [] as $item) {
            $idValues[] = is_array($item) ? $item[$idField] : $item;
        }

        return new ArrayCollection($repository->findBy([$idField => $idValues]));
    }
}