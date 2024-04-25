<?php

namespace App\DTO\Statement\Import;

use DateTime;

interface StatementImportRowInterface
{
    public function getLabel(): string;

    public function getAmount(): float;

    public function getCreatedAt(): DateTime;

    public function isConfirmed(): bool;

    public function getCategoryName(): ?string;

    public function getDescription(): ?string;
}