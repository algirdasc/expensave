<?php

declare(strict_types=1);

namespace App\Controller\Finance;

use App\Controller\AbstractApiController;
use App\Entity\Calendar;
use App\Entity\Expense;
use App\Helper\DateHelper;
use App\Repository\ExpenseRepository;
use App\Security\Voters\CalendarVoter;
use DateTime;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('api/calendar', name: 'calendar_expense_')]
class ExpenseExportController extends AbstractApiController
{
    private const array COLUMNS = ['date', 'label', 'category', 'calendar', 'amount', 'user', 'description', 'confirmed'];

    public function __construct(
        private readonly ExpenseRepository $expenseRepository,
    ) {
    }

    #[Route('/{calendar}/export/{dateFrom}/{dateTo}', name: 'export', methods: Request::METHOD_GET)]
    public function export(Calendar $calendar, DateTime $dateFrom, DateTime $dateTo): Response
    {
        $this->denyAccessUnlessGranted(CalendarVoter::VIEW, $calendar);

        DateHelper::setRange($dateFrom, $dateTo);

        $expenses = $this->expenseRepository->findByCalendarsAndInterval([$calendar], $dateFrom, $dateTo);

        // ponytail: buffered in php://temp, memory-safe for realistic per-calendar volumes; stream if exports ever hit 100k+ rows
        $handle = fopen('php://temp', 'r+');
        if ($handle === false) {
            throw new \RuntimeException('Unable to open temporary stream');
        }

        fputcsv($handle, self::COLUMNS);
        foreach ($expenses as $expense) {
            fputcsv($handle, $this->toRow($expense));
        }

        rewind($handle);
        $content = stream_get_contents($handle);
        fclose($handle);

        $filename = sprintf(
            'expenses-%s-%s-%s.csv',
            $this->slugify($calendar->getName()),
            $dateFrom->format('Y-m-d'),
            $dateTo->format('Y-m-d')
        );

        return new Response((string) $content, Response::HTTP_OK, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => sprintf('attachment; filename="%s"', $filename),
        ]);
    }

    /**
     * @return array<string|float>
     */
    private function toRow(Expense $expense): array
    {
        return [
            $expense->getCreatedAt()->format('Y-m-d H:i:s'),
            $expense->getLabel(),
            $expense->getCategory()->getName(),
            $expense->getCalendar()->getName(),
            $expense->getAmount(),
            $expense->getUser()->getEmail(),
            (string) $expense->getDescription(),
            $expense->isConfirmed() ? '1' : '0',
        ];
    }

    private function slugify(string $name): string
    {
        return strtolower((string) preg_replace('/[^a-zA-Z0-9]+/', '-', $name));
    }
}
