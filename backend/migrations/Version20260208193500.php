<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260208193500 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add recurring expense schedules and link generated expenses to schedule.';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE recurring_expense (id INT AUTO_INCREMENT NOT NULL, user_id INT NOT NULL, calendar_id INT NOT NULL, category_id INT NOT NULL, amount DOUBLE PRECISION NOT NULL, label VARCHAR(255) NOT NULL, description LONGTEXT DEFAULT NULL, confirmed TINYINT(1) NOT NULL, start_at DATETIME NOT NULL, next_run_at DATETIME NOT NULL, end_at DATETIME DEFAULT NULL, frequency VARCHAR(255) NOT NULL, `interval` INT NOT NULL, active TINYINT(1) NOT NULL, created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL, INDEX IDX_8C88E6BDA76ED395 (user_id), INDEX IDX_8C88E6BD3E3C8C06 (calendar_id), INDEX IDX_8C88E6BD12469DE2 (category_id), INDEX IDX_8C88E6BDFE5B8E3E (next_run_at), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE recurring_expense ADD CONSTRAINT FK_8C88E6BDA76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE recurring_expense ADD CONSTRAINT FK_8C88E6BD3E3C8C06 FOREIGN KEY (calendar_id) REFERENCES calendar (id)');
        $this->addSql('ALTER TABLE recurring_expense ADD CONSTRAINT FK_8C88E6BD12469DE2 FOREIGN KEY (category_id) REFERENCES category (id)');

        $this->addSql('ALTER TABLE expense ADD recurring_expense_id INT DEFAULT NULL, ADD recurring_occurrence_at DATETIME DEFAULT NULL');
        $this->addSql('ALTER TABLE expense ADD CONSTRAINT FK_2D3A8DA9A50F1DC FOREIGN KEY (recurring_expense_id) REFERENCES recurring_expense (id) ON DELETE SET NULL');
        $this->addSql('CREATE INDEX IDX_2D3A8DA9A50F1DC ON expense (recurring_expense_id)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_EXPENSE_RECURRING_OCCURRENCE ON expense (recurring_expense_id, recurring_occurrence_at)');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE expense DROP FOREIGN KEY FK_2D3A8DA9A50F1DC');
        $this->addSql('DROP INDEX UNIQ_EXPENSE_RECURRING_OCCURRENCE ON expense');
        $this->addSql('DROP INDEX IDX_2D3A8DA9A50F1DC ON expense');
        $this->addSql('ALTER TABLE expense DROP recurring_expense_id, DROP recurring_occurrence_at');

        $this->addSql('DROP TABLE recurring_expense');
    }
}
