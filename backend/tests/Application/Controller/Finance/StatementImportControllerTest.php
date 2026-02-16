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

        $this->client->request('POST', '/api/calendar/1/import', [], [
            'statement' => $uploadedFile
        ], [
            'CONTENT_TYPE' => 'multipart/form-data',
            'HTTP_ACCEPT' => 'multipart/form-data',
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