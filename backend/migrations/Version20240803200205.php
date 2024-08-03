<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240803200205 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE INDEX IDX_2D3A8DA6EA750E8 ON expense (label)');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP INDEX IDX_2D3A8DA6EA750E8 ON expense');
    }
}
