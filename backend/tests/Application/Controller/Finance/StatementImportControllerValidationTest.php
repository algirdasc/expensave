<?php

declare(strict_types=1);

namespace App\Tests\Application\Controller\Finance;

use App\Controller\Finance\StatementImportController;
use App\Tests\ApplicationTestCase;
use PHPUnit\Framework\Attributes\CoversClass;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;

#[CoversClass(StatementImportController::class)]
class StatementImportControllerValidationTest extends ApplicationTestCase
{
    private KernelBrowser $client;

    public function setUp(): void
    {
        parent::setUp();

        $this->client = $this->getAuthenticatedClient();
    }

    public function testImportRequiresStatementFile(): void
    {
        $this->client->request('POST', '/api/calendar/1/import', [], [], [
            'CONTENT_TYPE' => 'multipart/form-data',
            'HTTP_ACCEPT' => 'multipart/form-data',
        ]);

        $this->assertResponseStatusCodeSame(422);
        $this->assertResponseEqualToJson(
            $this->client->getResponse(),
            'Response/StatementImport/statement-import-missing-file.json'
        );
    }
}
