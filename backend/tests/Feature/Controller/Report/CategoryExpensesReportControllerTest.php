<?php

declare(strict_types=1);

namespace App\Tests\Feature\Controller\Report;

use App\Tests\BrowserTestCase;

class CategoryExpensesReportControllerTest extends BrowserTestCase
{
    public function testAccessDenied(): void
    {
        $browser = $this->getAuthenticatedJsonBrowser();

        $crawler = $browser->request('GET', '/api/report/category-expenses/1/2024-01-01/2024-12-31');

        $this->assertResponseIsSuccessful();
        $this->assertSelectorTextContains('h1', 'Hello World');
    }
}