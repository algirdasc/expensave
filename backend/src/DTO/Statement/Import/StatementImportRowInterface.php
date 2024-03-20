<?php

namespace App\DTO\Statement\Import;

use DateTime;

interface StatementImportRowInterface
{
    public function getStatementId(): string;

    public function getLabel(): string;

    public function getAmount(): float;

    public function getCreatedAt(): DateTime;

    public function getIdentification(): ?string;

    public function getStatementHash(): string;

    public function isConfirmed(): bool;

    public function getCategoryName(): ?string;

    public function getDescription(): ?string;
}