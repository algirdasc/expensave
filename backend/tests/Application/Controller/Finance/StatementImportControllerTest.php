<?php

declare(strict_types=1);

namespace App\Tests\Application\Controller\Finance;

use App\Tests\ApplicationTestCase;
use PHPUnit\Framework\Attributes\DataProvider;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class StatementImportControllerTest extends ApplicationTestCase
{
    private KernelBrowser $client;

    public function setUp(): void
    {
        parent::setUp();

        $this->client = $this->getAuthenticatedClient();
    }

    #[DataProvider('filePathProvider')]
    public function testStatementImport(string $filePath): void
    {
        // Mark as "test" upload; otherwise Symfony treats it as non-uploaded and validation may see an empty request.
        $uploadedFile = new UploadedFile($filePath, basename($filePath), test: true);
        $calendarId = $this->getCalendarId('User 1 Calendar');

        $this->client->request('POST', sprintf('/api/calendar/%d/import', $calendarId), [], [
            'statement' => $uploadedFile
        ], [
            'CONTENT_TYPE' => 'multipart/form-data',
            'HTTP_ACCEPT' => 'multipart/form-data',
        ]);

        $this->assertResponseIsSuccessful();

        $response = $this->getJsonResponse($this->client);
        $this->assertArrayHasKey('expenses', $response);
        $this->assertCount(1, $response['expenses']);

        $expense = $response['expenses'][0];
        $this->assertNull($expense['id']);
        $this->assertSame(-0.2, $expense['amount']);
        $this->assertSame('Something', $expense['label']);
        $this->assertSame('Something', $expense['description']);
        $this->assertTrue($expense['confirmed']);
        $this->assertSame('2024-08-01 09:55:13', $expense['createdAt']);
        $this->assertSame('User 1 Calendar', $expense['calendar']['name']);
        $this->assertSame('user1@email.com', $expense['user']['email']);
        $this->assertSame('Uncategorized', $expense['category']['name']);
        $this->assertSame('uncategorized', $expense['category']['type']);
    }

    public static function filePathProvider(): array
    {
        return [
            'Revolut' => [self::getAssetFile('Files/StatementImport/account-statement_2024-08-01_2024-09-01_en-us_d371f6.csv')],
        ];
    }
}
