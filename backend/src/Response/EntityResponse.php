<?php

declare(strict_types=1);

namespace App\Response;

use Symfony\Component\HttpFoundation\Response;

class EntityResponse extends AbstractResponse
{
    public function __construct(mixed $entity)
    {
        parent::__construct($entity, null === $entity ? Response::HTTP_NOT_FOUND : Response::HTTP_OK);
    }
}
