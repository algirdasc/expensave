<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240612200958 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE expense ADD transfer_from_id INT DEFAULT NULL, ADD transfer_to_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE expense ADD CONSTRAINT FK_2D3A8DA6C77BAB40 FOREIGN KEY (transfer_from_id) REFERENCES expense (id)');
        $this->addSql('ALTER TABLE expense ADD CONSTRAINT FK_2D3A8DA693B1BF3D FOREIGN KEY (transfer_to_id) REFERENCES expense (id)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_2D3A8DA6C77BAB40 ON expense (transfer_from_id)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_2D3A8DA693B1BF3D ON expense (transfer_to_id)');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE expense DROP FOREIGN KEY FK_2D3A8DA6C77BAB40');
        $this->addSql('ALTER TABLE expense DROP FOREIGN KEY FK_2D3A8DA693B1BF3D');
        $this->addSql('DROP INDEX UNIQ_2D3A8DA6C77BAB40 ON expense');
        $this->addSql('DROP INDEX UNIQ_2D3A8DA693B1BF3D ON expense');
        $this->addSql('ALTER TABLE expense DROP transfer_from_id, DROP transfer_to_id');
    }
}
