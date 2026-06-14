<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260614210000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add simple user roles and promote the first existing user to admin.';
    }

    public function up(Schema $schema): void
    {
        $this->addSql("ALTER TABLE `user` ADD role VARCHAR(16) NOT NULL DEFAULT 'user'");
        $this->addSql("UPDATE `user` SET role = 'admin' WHERE id = (SELECT id FROM (SELECT id FROM `user` ORDER BY id ASC LIMIT 1) first_user)");
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE `user` DROP role');
    }
}
