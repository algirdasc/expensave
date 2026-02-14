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
        $uploadedFile = new UploadedFile($filePath, basename($filePath));

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

    public function testSuggestReturnsBadRequestWhenContentTypeIsNotMultipartFormData(): void
    {
        $filePath = self::getAssetFile('Files/StatementImport/account-statement_2024-08-01_2024-09-01_en-us_d371f6.csv');
        $uploadedFile = new UploadedFile($filePath, basename($filePath));

        $this->client->request('POST', '/api/calendar/1/import', [], [
            'statement' => $uploadedFile,
        ], [
            'CONTENT_TYPE' => 'application/json',
            'HTTP_ACCEPT' => 'application/json',
        ]);

        $this->assertResponseStatusCodeSame(400);

        $payload = json_decode((string) $this->client->getResponse()->getContent(), true);

        self::assertIsArray($payload);
        self::assertSame('Symfony\\Component\\HttpKernel\\Exception\\BadRequestHttpException', $payload['throwable'] ?? null);
        self::assertSame('Invalid content type. Content type must be form-data.', $payload['messages'][0]['message'] ?? null);
    }

    public static function filePathProvider(): array
    {
        return [
            'Revolut' => [self::getAssetFile('Files/StatementImport/account-statement_2024-08-01_2024-09-01_en-us_d371f6.csv')],
        ];
    }
}