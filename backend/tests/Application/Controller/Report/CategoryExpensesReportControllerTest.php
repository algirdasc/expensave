<?php

declare(strict_types=1);

namespace App\Tests\Application\Controller\Report;

use App\Controller\Report\CategoryExpensesReportController;
use App\Entity\Calendar;
use App\Repository\CalendarRepository;
use App\Tests\ApplicationTestCase;
use App\Tests\BrowserTestCase;
use PHPUnit\Framework\Attributes\CoversClass;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Symfony\Component\HttpFoundation\Response;

#[CoversClass(CategoryExpensesReportController::class)]
class CategoryExpensesReportControllerTest extends ApplicationTestCase
{
    private CalendarRepository $calendarRepository;

    private KernelBrowser $client;

    public function setUp(): void
    {
        parent::setUp();

        $this->client = $this->getAuthenticatedClient();
        $this->calendarRepository = static::getContainer()->get(CalendarRepository::class);
    }

    public function testInvoke(): void
    {
        $this->client->jsonRequest('GET', '/api/report/category-expenses/1,3/2024-01-01/2024-12-31');

        $response = $this->client->getResponse();

        $this->assertResponseIsSuccessful();

        $responseJson = json_decode((string) $response->getContent(), true);

        $this->assertArrayHasKey('categoryBalances', $responseJson);
        $this->assertCount(4, $responseJson['categoryBalances']);

        $this->assertArrayHasKey('meta', $responseJson);
        $this->assertEquals(['change' => -20, 'expense' => -75, 'income' => 55], $responseJson['meta']);
    }

    public function testAccessDenied(): void
    {
        /** @var Calendar $calendar */
        $calendar = $this->calendarRepository->find(2);

        $this->client->jsonRequest('GET', "/api/report/category-expenses/{$calendar->getId()}/2024-01-01/2024-12-31");

        $this->assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);
    }
}