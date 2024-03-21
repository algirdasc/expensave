<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240320190140 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE calendar (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, balance DOUBLE PRECISION NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE calendar_user (calendar_id INT NOT NULL, user_id INT NOT NULL, INDEX IDX_DF05551DA40A2C8 (calendar_id), INDEX IDX_DF05551DA76ED395 (user_id), PRIMARY KEY(calendar_id, user_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE calendar_identification (id INT AUTO_INCREMENT NOT NULL, calendar_id INT DEFAULT NULL, name VARCHAR(255) NOT NULL, identification VARCHAR(255) NOT NULL, UNIQUE INDEX UNIQ_FB652D5D49E7720D (identification), INDEX IDX_FB652D5DA40A2C8 (calendar_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE category (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, color VARCHAR(8) NOT NULL, UNIQUE INDEX UNIQ_64C19C15E237E06 (name), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE category_rule (id INT AUTO_INCREMENT NOT NULL, category_id INT DEFAULT NULL, name VARCHAR(255) NOT NULL, pattern VARCHAR(255) NOT NULL, INDEX IDX_CD43D68B12469DE2 (category_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE expense (id INT AUTO_INCREMENT NOT NULL, category_id INT DEFAULT NULL, calendar_id INT DEFAULT NULL, user_id INT DEFAULT NULL, amount DOUBLE PRECISION NOT NULL, label VARCHAR(255) NOT NULL, confirmed TINYINT(1) NOT NULL, description LONGTEXT DEFAULT NULL, statement_hash VARCHAR(255) DEFAULT NULL, created_at DATETIME NOT NULL, UNIQUE INDEX UNIQ_2D3A8DA6C3986294 (statement_hash), INDEX IDX_2D3A8DA612469DE2 (category_id), INDEX IDX_2D3A8DA6A40A2C8 (calendar_id), INDEX IDX_2D3A8DA6A76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE refresh_token (id INT AUTO_INCREMENT NOT NULL, refresh_token VARCHAR(128) NOT NULL, username VARCHAR(255) NOT NULL, valid DATETIME NOT NULL, UNIQUE INDEX UNIQ_C74F2195C74F2195 (refresh_token), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE `user` (id INT AUTO_INCREMENT NOT NULL, email VARCHAR(255) NOT NULL, name VARCHAR(255) NOT NULL, roles JSON NOT NULL, password VARCHAR(255) NOT NULL, avatar LONGTEXT DEFAULT NULL, active TINYINT(1) NOT NULL, last_login_at DATETIME DEFAULT NULL, UNIQUE INDEX UNIQ_8D93D649E7927C74 (email), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE calendar_user ADD CONSTRAINT FK_DF05551DA40A2C8 FOREIGN KEY (calendar_id) REFERENCES calendar (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE calendar_user ADD CONSTRAINT FK_DF05551DA76ED395 FOREIGN KEY (user_id) REFERENCES `user` (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE calendar_identification ADD CONSTRAINT FK_FB652D5DA40A2C8 FOREIGN KEY (calendar_id) REFERENCES calendar (id)');
        $this->addSql('ALTER TABLE category_rule ADD CONSTRAINT FK_CD43D68B12469DE2 FOREIGN KEY (category_id) REFERENCES category (id)');
        $this->addSql('ALTER TABLE expense ADD CONSTRAINT FK_2D3A8DA612469DE2 FOREIGN KEY (category_id) REFERENCES category (id)');
        $this->addSql('ALTER TABLE expense ADD CONSTRAINT FK_2D3A8DA6A40A2C8 FOREIGN KEY (calendar_id) REFERENCES calendar (id)');
        $this->addSql('ALTER TABLE expense ADD CONSTRAINT FK_2D3A8DA6A76ED395 FOREIGN KEY (user_id) REFERENCES `user` (id)');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE calendar_user DROP FOREIGN KEY FK_DF05551DA40A2C8');
        $this->addSql('ALTER TABLE calendar_user DROP FOREIGN KEY FK_DF05551DA76ED395');
        $this->addSql('ALTER TABLE calendar_identification DROP FOREIGN KEY FK_FB652D5DA40A2C8');
        $this->addSql('ALTER TABLE category_rule DROP FOREIGN KEY FK_CD43D68B12469DE2');
        $this->addSql('ALTER TABLE expense DROP FOREIGN KEY FK_2D3A8DA612469DE2');
        $this->addSql('ALTER TABLE expense DROP FOREIGN KEY FK_2D3A8DA6A40A2C8');
        $this->addSql('ALTER TABLE expense DROP FOREIGN KEY FK_2D3A8DA6A76ED395');
        $this->addSql('DROP TABLE calendar');
        $this->addSql('DROP TABLE calendar_user');
        $this->addSql('DROP TABLE calendar_identification');
        $this->addSql('DROP TABLE category');
        $this->addSql('DROP TABLE category_rule');
        $this->addSql('DROP TABLE expense');
        $this->addSql('DROP TABLE refresh_token');
        $this->addSql('DROP TABLE `user`');
    }
}
