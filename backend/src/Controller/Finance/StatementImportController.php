<?php

declare(strict_types=1);

namespace App\Controller\Finance;

use App\Controller\AbstractApiController;
use App\Entity\Calendar;
use App\Exception\StatementImportException;
use App\Response\StatementImport\StatementImportResponse;
use App\Security\Voters\CalendarVoter;
use App\Service\Statement\Import\ImporterService;
use App\Service\Statement\Import\Resolver\StatementImportResolver;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('api/calendar', name: 'calendar_statement_')]
class StatementImportController extends AbstractApiController
{
    public function __construct(
        private readonly ImporterService $importerService,
        private readonly EntityManagerInterface $entityManager
    ) {
    }

    #[Route('/{calendar}/import', name: 'import', methods: Request::METHOD_POST)]
    public function import(Calendar $calendar, StatementImportResolver $statementImportResolver, Request $request): Response
    {
        $this->denyAccessUnlessGranted(CalendarVoter::IMPORT, $calendar);

        $errors = [];

        /** @var array<UploadedFile> $statementFiles */
        $statementFiles = $request->files->get('statements') ?? [];
        foreach ($statementFiles as $statementFile) {
            $importHandler = $statementImportResolver->getHandler($statementFile);

            foreach ($importHandler->process($statementFile) as $row) {
                try {
                    set_time_limit(30); // prevent execution timeout
                    $this->importerService->import($row, $calendar);
                } catch (StatementImportException $exception) {
                    $errors[$statementFile->getClientOriginalName()][] = $exception->getMessage();
                }
            }

            $this->entityManager->flush();
        }

        return $this->respond(new StatementImportResponse($errors));
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
