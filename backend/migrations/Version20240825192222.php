<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240825192222 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE category_rule ADD label VARCHAR(255) NOT NULL, ADD owner_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE category_rule ADD CONSTRAINT FK_CD43D68B7E3C61F9 FOREIGN KEY (owner_id) REFERENCES `user` (id)');
        $this->addSql('CREATE INDEX IDX_CD43D68B7E3C61F9 ON category_rule (owner_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE category_rule DROP FOREIGN KEY FK_CD43D68B7E3C61F9');
        $this->addSql('DROP INDEX IDX_CD43D68B7E3C61F9 ON category_rule');
        $this->addSql('ALTER TABLE category_rule DROP label, DROP owner_id');
    }
}
