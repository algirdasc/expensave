<?php

declare(strict_types=1);

namespace App\Attribute\Request;

use Attribute;

#[Attribute(Attribute::TARGET_PROPERTY)]
class ResolveEntity
{
    /**
     * @param array<string, mixed>|null $defaultCriteria
     */
    public function __construct(
        private readonly ?array $defaultCriteria = null
    ) {
    }

    /**
     * @return array<string, mixed>|null
     */
    public function getDefaultCriteria(): ?array
    {
        return $this->defaultCriteria;
    }
}