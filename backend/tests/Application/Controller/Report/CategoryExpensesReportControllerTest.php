<?php

declare(strict_types=1);

namespace App\Tests\Feature\Controller\Report;

use App\Controller\Report\CategoryExpensesReportController;
use App\Entity\Calendar;
use App\Repository\CalendarRepository;
use App\Tests\BrowserTestCase;
use PHPUnit\Framework\Attributes\CoversClass;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Symfony\Component\HttpFoundation\Response;

#[CoversClass(CategoryExpensesReportController::class)]
class CategoryExpensesReportControllerTest extends BrowserTestCase
{
    private CalendarRepository $calendarRepository;

    private KernelBrowser $browser;

    public function setUp(): void
    {
        parent::setUp();

        $this->browser = $this->getAuthenticatedJsonBrowser();
        $this->calendarRepository = static::getContainer()->get(CalendarRepository::class);
    }

    public function testInvoke(): void
    {
        $user = $this->getUser();
        $calendarIds = $this->getUserCalendarIds($user);

        $this->assertCount(2, $calendarIds);

        $this->browser->request(
            'GET',
            sprintf("/api/report/category-expenses/%s/2024-01-01/2024-12-31", implode(',', $calendarIds))
        );

        $response = $this->browser->getResponse();

        $this->assertResponseIsSuccessful();

        $responseJson = json_decode((string) $response->getContent(), true);

        $this->assertArrayHasKey('categoryBalances', $responseJson);
        $this->assertCount(3, $responseJson['categoryBalances']);

        $this->assertArrayHasKey('meta', $responseJson);
        $this->assertEquals(['change' => -20, 'expense' => -75, 'income' => 55], $responseJson['meta']);
    }

    public function testAccessDenied(): void
    {
        /** @var Calendar $calendar */
        $calendar = $this->calendarRepository->findOneBy(['owner' => $this->getUser('User 2')]);

        $this->browser->request('GET', "/api/report/category-expenses/{$calendar->getId()}/2024-01-01/2024-12-31");

        $this->assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);
    }
}