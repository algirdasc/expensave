<?php

declare(strict_types=1);

namespace App\Command;

use App\Entity\Calendar;
use App\Entity\User;
use App\Enum\UserRole;
use App\Repository\CalendarRepository;
use App\Repository\UserRepository;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[AsCommand(
    name: 'app:user:create',
    description: 'Create a new user',
)]
class CreateUserCommand extends Command
{
    public function __construct(
        private readonly UserRepository $userRepository,
        private readonly CalendarRepository $calendarRepository,
        private readonly ValidatorInterface $validator,
    ) {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this
            ->addOption('email', null, InputOption::VALUE_REQUIRED, 'User email address')
            ->addOption('name', null, InputOption::VALUE_REQUIRED, 'User display name')
            ->addOption('password', null, InputOption::VALUE_REQUIRED, 'User password')
            ->addOption('admin', null, InputOption::VALUE_NONE, 'Grant admin role')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $email = $input->getOption('email');
        $name = $input->getOption('name');
        $password = $input->getOption('password');
        $isAdmin = (bool) $input->getOption('admin');

        // Interactive prompts for missing options
        if (!$email) {
            $email = $io->ask('Email address');
        }

        if (!$name) {
            $name = $io->ask('Display name', $email);
        }

        if (!$password) {
            $password = $io->askHidden('Password');
        }

        if (!$email || !$password) {
            $io->error('Email and password are required.');

            return Command::FAILURE;
        }

        $user = new User();
        $user->setEmail($email);
        $user->setName($name ?? $email);
        $user->setPlainPassword($password);
        $user->setActive(true);
        $user->setRole($isAdmin ? UserRole::ADMIN : UserRole::USER);

        $errors = $this->validator->validate($user);
        if (count($errors) > 0) {
            foreach ($errors as $error) {
                $io->error((string) $error->getMessage());
            }

            return Command::FAILURE;
        }

        $this->userRepository->save($user);

        $calendar = new Calendar('Personal', $user);
        $this->calendarRepository->save($calendar);

        $user->setDefaultCalendarId($calendar->getId());
        $this->userRepository->save($user);

        $io->success(sprintf(
            'User "%s" created successfully%s. Default calendar "Personal" created.',
            $email,
            $isAdmin ? ' with admin role' : '',
        ));

        return Command::SUCCESS;
    }
}
