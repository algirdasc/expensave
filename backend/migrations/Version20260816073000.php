<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260816073000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add refresh token family columns required by gesdinet/jwt-refresh-token-bundle 3.0.';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE refresh_token ADD family VARCHAR(32) DEFAULT NULL, ADD family_valid DATETIME DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE refresh_token DROP family, DROP family_valid');
    }
}
