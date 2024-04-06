<?php

declare(strict_types=1);

namespace App\Command;

use App\Repository\CalendarRepository;
use App\Repository\ExpenseRepository;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand('app:calendar:recalculate-balance')]
class RecalculateBalanceCommand extends Command
{
    public function __construct(
        private readonly CalendarRepository $calendarRepository,
        private readonly ExpenseRepository $expenseRepository,
    ) {
        parent::__construct();
    }

    public function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $calendars = $this->calendarRepository->findAll();

        foreach ($calendars as $calendar) {
            $balance = $this->expenseRepository->getTotalBalance($calendar);
            $calendar->setBalance($balance);

            $this->calendarRepository->save($calendar);
        }

        $io->success('Balances was recalculated');

        return Command::SUCCESS;
    }
}