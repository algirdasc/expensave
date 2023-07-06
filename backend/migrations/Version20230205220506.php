<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230205220506 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE calendar_identification ADD name VARCHAR(255) NOT NULL');
        $this->addSql('ALTER TABLE expense DROP INDEX IDX_2D3A8DA6849CB65B, ADD UNIQUE INDEX UNIQ_2D3A8DA6C3986294 (statement_hash)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE expense DROP INDEX UNIQ_2D3A8DA6C3986294, ADD INDEX IDX_2D3A8DA6849CB65B (statement_hash)');
        $this->addSql('ALTER TABLE calendar_identification DROP name');
    }
}
