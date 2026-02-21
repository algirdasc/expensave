<?php

declare(strict_types=1);

namespace App\Command;

use App\Service\RecurringExpense\RecurringExpenseGeneratorService;
use DateTime;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;

#[AsCommand(
    name: 'app:recurring-expenses:generate',
    description: 'Generate due recurring expense occurrences',
)]
class GenerateRecurringExpensesCommand extends Command
{
    public function __construct(
        private readonly RecurringExpenseGeneratorService $generator,
    ) {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this
            ->addOption('now', null, InputOption::VALUE_OPTIONAL, 'Override current time (Y-m-d H:i:s)')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $now = $input->getOption('now');
        $nowDt = $now ? new DateTime((string) $now) : new DateTime();

        $count = $this->generator->generate($nowDt);
        $output->writeln(sprintf('Generated %d recurring expense(s).', $count));

        return Command::SUCCESS;
    }
}
