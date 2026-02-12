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
        // IMPORTANT: do NOT force CONTENT_TYPE manually.
        // BrowserKit will build a proper multipart request (incl. boundary) when files are provided.
        $uploadedFile = new UploadedFile($filePath, basename($filePath), test: true);

        $this->client->request('POST', '/api/calendar/1/import', [], [
            'statement' => $uploadedFile,
        ], [
            'HTTP_ACCEPT' => 'application/json',
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