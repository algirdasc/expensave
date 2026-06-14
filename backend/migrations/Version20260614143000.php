<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260614143000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add recurring expense rules and link generated expenses to their source rule.';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE recurring_expense (id INT AUTO_INCREMENT NOT NULL, calendar_id INT DEFAULT NULL, category_id INT DEFAULT NULL, user_id INT DEFAULT NULL, frequency VARCHAR(16) NOT NULL, occurrences INT NOT NULL, label VARCHAR(255) NOT NULL, description LONGTEXT DEFAULT NULL, amount DOUBLE PRECISION NOT NULL, confirmed TINYINT(1) NOT NULL, starts_at DATETIME NOT NULL, INDEX IDX_5B9D3884A40A2C8 (calendar_id), INDEX IDX_5B9D38812469DE2 (category_id), INDEX IDX_5B9D388A76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('ALTER TABLE recurring_expense ADD CONSTRAINT FK_5B9D3884A40A2C8 FOREIGN KEY (calendar_id) REFERENCES calendar (id)');
        $this->addSql('ALTER TABLE recurring_expense ADD CONSTRAINT FK_5B9D38812469DE2 FOREIGN KEY (category_id) REFERENCES category (id)');
        $this->addSql('ALTER TABLE recurring_expense ADD CONSTRAINT FK_5B9D388A76ED395 FOREIGN KEY (user_id) REFERENCES `user` (id)');
        $this->addSql('ALTER TABLE expense ADD recurring_expense_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE expense ADD CONSTRAINT FK_2D3A8DA17CE54B0A FOREIGN KEY (recurring_expense_id) REFERENCES recurring_expense (id)');
        $this->addSql('CREATE INDEX IDX_2D3A8DA17CE54B0A ON expense (recurring_expense_id)');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE expense DROP FOREIGN KEY FK_2D3A8DA17CE54B0A');
        $this->addSql('DROP TABLE recurring_expense');
        $this->addSql('DROP INDEX IDX_2D3A8DA17CE54B0A ON expense');
        $this->addSql('ALTER TABLE expense DROP recurring_expense_id');
    }
}
