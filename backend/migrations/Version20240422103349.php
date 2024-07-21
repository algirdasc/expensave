<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240422103349 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE calendar_identification DROP FOREIGN KEY FK_FB652D5DA40A2C8');
        $this->addSql('DROP TABLE calendar_identification');
        $this->addSql('DROP INDEX UNIQ_2D3A8DA6C3986294 ON expense');
        $this->addSql('ALTER TABLE expense DROP statement_hash');
        $this->addSql('ALTER TABLE user DROP roles');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('CREATE TABLE calendar_identification (id INT AUTO_INCREMENT NOT NULL, calendar_id INT DEFAULT NULL, name VARCHAR(255) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, identification VARCHAR(255) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, INDEX IDX_FB652D5DA40A2C8 (calendar_id), UNIQUE INDEX UNIQ_FB652D5D49E7720D (identification), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('ALTER TABLE calendar_identification ADD CONSTRAINT FK_FB652D5DA40A2C8 FOREIGN KEY (calendar_id) REFERENCES calendar (id)');
        $this->addSql('ALTER TABLE expense ADD statement_hash VARCHAR(255) DEFAULT NULL');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_2D3A8DA6C3986294 ON expense (statement_hash)');
        $this->addSql('ALTER TABLE user ADD roles JSON NOT NULL');
    }
}
