<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240609190117 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE expense ADD related_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE expense ADD CONSTRAINT FK_2D3A8DA64162C001 FOREIGN KEY (related_id) REFERENCES expense (id)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_2D3A8DA64162C001 ON expense (related_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE expense DROP FOREIGN KEY FK_2D3A8DA64162C001');
        $this->addSql('DROP INDEX UNIQ_2D3A8DA64162C001 ON expense');
        $this->addSql('ALTER TABLE expense DROP related_id');
    }
}
