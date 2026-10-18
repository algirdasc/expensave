<?php

declare(strict_types=1);

namespace App\Mcp;

use App\Const\ContextGroup\CalendarContextGroupConst;
use App\Repository\CalendarRepository;
use App\Repository\CategoryRepository;
use App\Repository\ExpenseRepository;
use App\Security\UserContextProvider;
use App\Security\Voters\CalendarVoter;
use Mcp\Capability\Attribute\McpTool;
use Mcp\Capability\Attribute\Schema;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

final class CalendarTools extends AbstractMcpTools
{
    public function __construct(
        Security $security,
        NormalizerInterface $normalizer,
        CalendarRepository $calendarRepository,
        CategoryRepository $categoryRepository,
        ExpenseRepository $expenseRepository,
        private readonly UserContextProvider $userContextProvider,
    ) {
        parent::__construct($security, $normalizer, $calendarRepository, $categoryRepository, $expenseRepository);
    }

    /**
     * @return array<mixed>
     */
    #[McpTool(name: 'list-calendars', description: 'List calendars the user owns or collaborates on, sorted by name.')]
    public function listCalendars(): array
    {
        return $this->serialize($this->calendarRepository->findAllByUser($this->userContextProvider->getUser()));
    }

    /**
     * @return array<mixed>
     */
    #[McpTool(name: 'get-calendar', description: 'Get a single calendar by ID, including its collaborators.')]
    public function getCalendar(
        #[Schema(description: 'Calendar ID')] int $calendarId,
    ): array {
        $calendar = $this->findCalendarOrFail($calendarId);
        $this->denyAccessUnlessGranted(CalendarVoter::VIEW, $calendar);

        return $this->serialize($calendar, [CalendarContextGroupConst::DETAILS]);
    }
}
