<?php

declare(strict_types=1);

namespace App\Request;

use App\Attribute\Request\ResolveEntity;
use App\Handler\Request\TransformationHandlerInterface;
use Doctrine\ORM\EntityManagerInterface;
use LogicException;
use ReflectionClass;
use ReflectionNamedType;
use Symfony\Component\DependencyInjection\Attribute\TaggedIterator;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PropertyAccess\PropertyAccess;

abstract class AbstractRequest
{
    /**
     * @var iterable<TransformationHandlerInterface>
     */
    private iterable $transformationHandlers;

    /**
     * @param iterable<TransformationHandlerInterface> $transformationHandlers
     */
    public function __construct(
        #[TaggedIterator('app.handlers.request.transformation')] iterable $transformationHandler
    ) {
        $this->transformationHandlers = $transformationHandler;

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

            foreach ($this->transformationHandlers as $transformationHandler) {
                if (!$transformationHandler->supportsProperty($property)) {
                    continue;
                }

                $transformedValue = $transformationHandler->transform($this, $property, $value);

                if (!$type->allowsNull() && null === $transformedValue) {
                    break;
                }

                $propertyAccessor->setValue($this, $propertyName, $transformedValue);

                break;
            }
        }
    }
}
