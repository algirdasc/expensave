<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260201124500 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add recurrence fields to expense table';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE expense ADD recurring_type VARCHAR(20) DEFAULT NULL, ADD recurring_id VARCHAR(36) DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE expense DROP recurring_type, DROP recurring_id');
    }
}
