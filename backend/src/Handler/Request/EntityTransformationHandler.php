<?php

namespace App\Handler\Request;

use App\Attribute\Request\ResolveEntity;
use App\Request\AbstractRequest;
use Doctrine\ORM\EntityManagerInterface;
use ReflectionProperty;

class EntityTransformationHandler implements TransformationHandlerInterface
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager
    ) {
    }

    public function supportsProperty(ReflectionProperty $property): bool
    {
        return !$property->getType()?->isBuiltin() && $property->getAttributes(ResolveEntity::class);
    }

    public function transform(AbstractRequest $request, ReflectionProperty $property, mixed $value): mixed
    {
        if (is_array($value)) {
            $value = $value['id'] ?? null;
        }

        if (null === $value) {
            return null;
        }

        $repository = $this->entityManager->getRepository((string) $property->getType()?->getName());

        return $repository->find($value);
    }
}