<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240320190157 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        $this->addSql("INSERT INTO category (name, color) VALUES ('Household', '#668686')");
        $this->addSql("INSERT INTO category (name, color) VALUES ('Subscriptions', '#dd8a06')");
        $this->addSql("INSERT INTO category (name, color) VALUES ('Income', '#19bc96')");
        $this->addSql("INSERT INTO category (name, color) VALUES ('Groceries', '#56cdd0')");
        $this->addSql("INSERT INTO category (name, color) VALUES ('Eating out', '#da4040')");
        $this->addSql("INSERT INTO category (name, color) VALUES ('Car & Transportation', '#6687e7')");
        $this->addSql("INSERT INTO category (name, color) VALUES ('Fitness', '#169dd5')");
        $this->addSql("INSERT INTO category (name, color) VALUES ('Transfer', '#394852')");
        $this->addSql("INSERT INTO category (name, color) VALUES ('Health', '#a8c85b')");
        $this->addSql("INSERT INTO category (name, color) VALUES ('Personal care', '#905d65')");
        $this->addSql("INSERT INTO category (name, color) VALUES ('Entertainment', '#d34d81')");
        $this->addSql("INSERT INTO category (name, color) VALUES ('Clothing', '#f9c463')");
        $this->addSql("INSERT INTO category (name, color) VALUES ('Mortgage', '#27ae60')");
    }

    public function down(Schema $schema): void
    {
        $this->addSql('TRUNCATE TABLE `category`');
    }
}
