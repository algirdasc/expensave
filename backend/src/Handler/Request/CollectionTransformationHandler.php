<?php

namespace App\Handler\Request;

use App\Attribute\Request\ResolveEntity;
use App\Request\AbstractRequest;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\EntityManagerInterface;
use ReflectionProperty;
use Symfony\Component\PropertyInfo\Extractor\PhpDocExtractor;

class CollectionTransformationHandler implements TransformationHandlerInterface
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager
    ) {
    }

    public function supportsProperty(ReflectionProperty $property): bool
    {
        return !$property->getType()?->isBuiltin() && Collection::class === $property->getType()?->getName();
    }

    public function transform(AbstractRequest $request, ReflectionProperty $property, mixed $value): mixed
    {
        $collectionTypes = (new PhpDocExtractor())->getTypes($request::class, $property->getName());

        if (null === $collectionTypes) {
            return $value;
        }

        $collectionValueType = $collectionTypes[0]->getCollectionValueTypes()[0]->getClassName();

        $repository = $this->entityManager->getRepository($collectionValueType);

        return new ArrayCollection($repository->findBy(['id' => $value]));
    }
}