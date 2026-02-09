<?php

declare(strict_types=1);

namespace App\Controller\Finance;

use App\Controller\AbstractApiController;
use App\Entity\Calendar;
use App\Request\Finance\StatementImportRequest;
use App\Response\StatementImport\StatementImportResponse;
use App\Security\Voters\CalendarVoter;
use App\Service\StatementImport\ImportService;
use App\Service\StatementImport\Resolver\StatementImportResolver;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('api/calendar', name: 'calendar_statement_')]
class StatementImportController extends AbstractApiController
{
    public function __construct(
        private readonly ImportService $importerService,
    ) {
    }

    #[Route('/{calendar}/import', name: 'import', methods: Request::METHOD_POST)]
    public function import(Calendar $calendar, StatementImportResolver $statementImportResolver, StatementImportRequest $request): Response
    {
        $this->denyAccessUnlessGranted(CalendarVoter::IMPORT, $calendar);

        $expenses = [];

        $statementFile = $request->getStatement();

        $importHandler = $statementImportResolver->getHandler($statementFile);
        foreach ($importHandler->process($statementFile) as $row) {
            set_time_limit(30); // prevent execution timeout

            $expense = $this->importerService->import($row, $calendar);
            if ($expense === null) {
                continue;
            }

            $expenses[] = $expense;
        }

        return $this->respond(new StatementImportResponse($expenses));
    }

    public function getAllowedContentTypeFormat(): string
    {
        return 'form';
    }

    public function getDisallowedContentTypeError(): string
    {
        return 'Invalid content type. Content type must be form-data.';
    }
}
