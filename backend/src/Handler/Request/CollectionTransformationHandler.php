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

        $repository = $this->entityManager->getRepository($entityClassName);

        return new ArrayCollection($repository->findBy(['id' => $value]));
    }
}