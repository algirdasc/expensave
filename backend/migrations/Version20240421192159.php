<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240421192159 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE user DROP avatar, DROP last_login_at');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE `user` ADD avatar LONGTEXT DEFAULT NULL, ADD last_login_at DATETIME DEFAULT NULL');
    }
}
