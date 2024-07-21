<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240421202139 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE calendar ADD owner_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE calendar ADD CONSTRAINT FK_6EA9A1467E3C61F9 FOREIGN KEY (owner_id) REFERENCES `user` (id)');
        $this->addSql('CREATE INDEX IDX_6EA9A1467E3C61F9 ON calendar (owner_id)');

        $this->addSql('UPDATE calendar SET owner_id = (SELECT user_id FROM calendar_user WHERE calendar_id = calendar.id LIMIT 1)');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE calendar DROP FOREIGN KEY FK_6EA9A1467E3C61F9');
        $this->addSql('DROP INDEX IDX_6EA9A1467E3C61F9 ON calendar');
        $this->addSql('ALTER TABLE calendar DROP owner_id');
    }
}
