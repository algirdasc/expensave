<?php

declare(strict_types=1);

namespace App\Tests\Application\Controller\Finance;

use App\Controller\Finance\StatementImportController;
use App\Tests\ApplicationTestCase;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\DataProvider;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Symfony\Component\BrowserKit\AbstractBrowser;
use Symfony\Component\HttpFoundation\File\UploadedFile;

#[CoversClass(StatementImportController::class)]
class StatementImportControllerTest extends ApplicationTestCase
{
    private KernelBrowser $client;

    public function setUp(): void
    {
        parent::setUp();

        $this->client = $this->getAuthenticatedClient();
    }

    #[DataProvider('filePathProvider')]
    public function testSuggest(string $filePath): void
    {
        // NOTE: getAuthenticatedClient() defaults to JSON requests (CONTENT_TYPE=application/json).
        // For file uploads the controller expects multipart/form-data, so override the default here.
        // We still let BrowserKit build the multipart body (incl. boundary) based on provided files.
        $uploadedFile = new UploadedFile($filePath, basename($filePath), test: true);

        $this->client->request('POST', '/api/calendar/1/import', [], [
            'statement' => $uploadedFile,
        ], [
            'HTTP_ACCEPT' => 'application/json',
            'CONTENT_TYPE' => 'multipart/form-data',
        ]);

        $this->assertResponseIsSuccessful();
        $this->assertResponseEqualToJson(
            $this->client->getResponse(),
            sprintf('Response/StatementImport/%s.json', $uploadedFile->getBasename())
        );
    }

    public static function filePathProvider(): array
    {
        return [
            'Revolut' => [self::getAssetFile('Files/StatementImport/account-statement_2024-08-01_2024-09-01_en-us_d371f6.csv')],
        ];
    }
}