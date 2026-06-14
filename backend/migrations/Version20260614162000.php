<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260614162000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add password reset token fields to users.';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE `user` ADD password_reset_token VARCHAR(255) DEFAULT NULL, ADD password_reset_token_expires_at DATETIME DEFAULT NULL');
        $this->addSql('CREATE INDEX IDX_8D93D649D1E04B6 ON `user` (password_reset_token)');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP INDEX IDX_8D93D649D1E04B6 ON `user`');
        $this->addSql('ALTER TABLE `user` DROP password_reset_token, DROP password_reset_token_expires_at');
    }
}
