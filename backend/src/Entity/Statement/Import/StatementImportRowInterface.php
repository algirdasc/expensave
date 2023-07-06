<?php

namespace App\Entity\Statement\Import;

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
}