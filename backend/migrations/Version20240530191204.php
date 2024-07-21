<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240530191204 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE category ADD type VARCHAR(255) NULL');
        $this->addSql("INSERT INTO category (name, color, type) VALUES ('Balance Update', '#24485d', 'balance_update') ON DUPLICATE KEY UPDATE type = VALUES(`type`)");
        $this->addSql("INSERT INTO category (name, color, type) VALUES ('Uncategorized', '#394852', 'uncategorized') ON DUPLICATE KEY UPDATE type = VALUES(`type`)");
        $this->addSql("UPDATE category SET type = 'user' WHERE type IS NULL");
        $this->addSql('ALTER TABLE category CHANGE type type VARCHAR(255) NOT NULL;');
        $this->addSql("UPDATE expense SET category_id = (SELECT id FROM category WHERE type = 'uncategorized') WHERE category_id IS NULL");
    }

    public function down(Schema $schema): void
    {
        $this->addSql("UPDATE expense SET category_id = null WHERE category_id = (SELECT id FROM category WHERE type = 'uncategorized')");
        $this->addSql('ALTER TABLE category DROP type');
    }
}
