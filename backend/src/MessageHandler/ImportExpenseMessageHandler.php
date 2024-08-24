<?php

declare(strict_types=1);

namespace App\MessageHandler;

use App\Message\ImportExpenseMessage;
use App\Repository\CalendarRepository;
use App\Repository\CategoryRepository;
use App\Repository\ExpenseRepository;
use App\Repository\UserRepository;
use App\Security\UserContextProvider;
use App\Security\Voters\CalendarVoter;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;
use Symfony\Component\Messenger\Exception\UnrecoverableMessageHandlingException;
use Throwable;

#[AsMessageHandler]
final readonly class ImportExpenseMessageHandler
{
    public function __construct(
        private Security $security,
        private LoggerInterface $logger,
        private UserContextProvider $userContextProvider,
        private ExpenseRepository $expenseRepository,
        private CategoryRepository $categoryRepository,
        private CalendarRepository $calendarRepository,
        private UserRepository $userRepository,
    ) {
    }

    public function __invoke(ImportExpenseMessage $expenseMessage): void
    {
        try {
            $this->createExpense($expenseMessage);
        } catch (Throwable $throwable) {
            $this->logger->error($throwable->getMessage(), ['expenseMessage' => $expenseMessage]);

            throw new UnrecoverableMessageHandlingException(previous: $throwable);
        }
    }

    private function createExpense(ImportExpenseMessage $expenseMessage): void
    {
        $expense = $expenseMessage->getExpense();

        $category = $this->categoryRepository->find($expenseMessage->getCategoryId());
        $calendar = $this->calendarRepository->find($expenseMessage->getCalendarId());
        $user = $this->userRepository->find($expenseMessage->getUserId());

        if ($category === null || $calendar === null || $user === null) {
            return;
        }

        $this->userContextProvider->login($user);
        if (!$this->security->isGranted(CalendarVoter::ADD_EXPENSE, $calendar)) {
            return;
        }

        $expense
            ->setCategory($category)
            ->setCalendar($calendar)
            ->setUser($user);

        $this->expenseRepository->save($expense);
    }
}
