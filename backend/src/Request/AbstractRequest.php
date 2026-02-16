<?php

declare(strict_types=1);

namespace App\Request;

use App\Handler\Request\TransformationHandlerInterface;
use LogicException;
use ReflectionClass;
use ReflectionNamedType;
use Symfony\Component\DependencyInjection\Attribute\AutowireIterator;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\PropertyAccess\PropertyAccess;

abstract class AbstractRequest
{
    /**
     * @param iterable<TransformationHandlerInterface> $transformationHandler
     */
    public function __construct(
        #[AutowireIterator('app.handler.request.transformation')] private readonly iterable $transformationHandler,
        private readonly RequestStack $requestStack,
    ) {
        $this->populate();
    }

    protected function populate(): void
    {
        $propertyAccessor = PropertyAccess::createPropertyAccessor();
        $reflection = new ReflectionClass($this);

        $request = $this->requestStack->getMainRequest();
        if ($request === null) {
            return;
        }

        foreach ($reflection->getProperties() as $property) {
            $propertyName = $property->getName();
            $type = $property->getType();

            if ($type === null) {
                throw new LogicException(sprintf('Property "%s" must have type set', $propertyName));
            }

            if (!$type instanceof ReflectionNamedType) {
                throw new LogicException(sprintf('Property "%s" must have named type set', $propertyName));
            }

            $value = $request->request->get($propertyName) ?? $request->files->get($propertyName);

            foreach ($this->transformationHandler as $transformationHandler) {
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
