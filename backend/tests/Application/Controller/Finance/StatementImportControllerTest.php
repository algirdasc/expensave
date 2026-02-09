<?php

declare(strict_types=1);

namespace App\Tests\Application\Controller\Finance;

use App\Controller\Finance\StatementImportController;
use App\Tests\ApplicationTestCase;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\DataProvider;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;
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
        $uploadedFile = new UploadedFile($filePath, basename($filePath), null, null, true);

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

    public function testImportReturns422WhenStatementFileIsMissing(): void
    {
        $this->client->request('POST', '/api/calendar/1/import', [], [], [
            'CONTENT_TYPE' => 'multipart/form-data',
            'HTTP_ACCEPT' => 'multipart/form-data',
        ]);

        $this->assertResponseStatusCodeSame(422);
        $this->assertResponseContains('Statement file is required.');
    }

    public function testImportReturns422WhenStatementFileMimeTypeIsUnsupported(): void
    {
        $filePath = $this->writeTempFile(str_repeat('x', 10));
        $uploadedFile = new UploadedFile($filePath, 'statement.txt', 'text/plain', null, true);

        $this->client->request('POST', '/api/calendar/1/import', [], [
            'statement' => $uploadedFile
        ], [
            'CONTENT_TYPE' => 'multipart/form-data',
            'HTTP_ACCEPT' => 'multipart/form-data',
        ]);

        $this->assertResponseStatusCodeSame(422);
        $this->assertResponseContains('Unsupported file type.');
    }

    public function testImportReturns422WhenStatementFileIsTooLarge(): void
    {
        // 5M max; send just over.
        $filePath = $this->writeTempFile(str_repeat('x', 5_000_001));
        $uploadedFile = new UploadedFile($filePath, 'statement.csv', 'text/csv', null, true);

        $this->client->request('POST', '/api/calendar/1/import', [], [
            'statement' => $uploadedFile
        ], [
            'CONTENT_TYPE' => 'multipart/form-data',
            'HTTP_ACCEPT' => 'multipart/form-data',
        ]);

        $this->assertResponseStatusCodeSame(422);
    }

    public static function filePathProvider(): array
    {
        return [
            'Revolut' => [self::getAssetFile('Files/StatementImport/account-statement_2024-08-01_2024-09-01_en-us_d371f6.csv')],
        ];
    }

    private function writeTempFile(string $contents): string
    {
        $path = tempnam(sys_get_temp_dir(), 'stmt_');
        if ($path === false) {
            self::fail('Failed to create temp file.');
        }

        file_put_contents($path, $contents);

        return $path;
    }
}