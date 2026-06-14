<?php

declare(strict_types=1);

namespace App\Tests\Application\Service\StatementImport\Handler;

use App\DTO\Statement\Import\Revolut\RevolutStatementRow;
use App\DTO\Statement\Import\Revolut\StateEnum;
use App\Service\StatementImport\Handler\RevolutImportHandler;
use DateTime;
use InvalidArgumentException;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\TestCase;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\Serializer\Normalizer\DenormalizerInterface;

#[CoversClass(RevolutImportHandler::class)]
class RevolutImportHandlerTest extends TestCase
{
    public function testProcessIgnoresSavingsTransferEvenWhenTypeIsNotUppercase(): void
    {
        $handler = new RevolutImportHandler($this->createRevolutRowDenormalizer());

        $filePath = __DIR__ . '/../../../../Files/StatementImport/account-statement_test_balance-transfer_and_savings_transfer.csv';
        $uploadedFile = new UploadedFile($filePath, basename($filePath), 'text/csv', null, true);

        $rows = iterator_to_array($handler->process($uploadedFile));

        // Balance Transfer (Current) should pass through.
        // Savings + Transfer should be ignored.
        self::assertCount(1, $rows);
        self::assertSame('Balance Transfer', $rows[0]->getType());
        self::assertSame('Current', $rows[0]->getProduct());
        self::assertSame(-0.2, $rows[0]->getAmount());
    }

    private function createRevolutRowDenormalizer(): DenormalizerInterface
    {
        return new class implements DenormalizerInterface {
            public function denormalize(mixed $data, string $type, ?string $format = null, array $context = []): mixed
            {
                if ($type !== RevolutStatementRow::class || !is_array($data)) {
                    throw new InvalidArgumentException('Unsupported Revolut test row.');
                }

                /** @var array{Type: string, Product: string, 'Started Date': string, 'Completed Date': string, Description: string, Amount: string, Fee: string, Currency: string, State: string, Balance: string} $data */
                return (new RevolutStatementRow())
                    ->setType($data['Type'])
                    ->setProduct($data['Product'])
                    ->setStartedDate(new DateTime($data['Started Date']))
                    ->setCompletedDate(new DateTime($data['Completed Date']))
                    ->setDescription($data['Description'])
                    ->setAmount($data['Amount'])
                    ->setFee($data['Fee'])
                    ->setCurrency($data['Currency'])
                    ->setState(StateEnum::from($data['State']))
                    ->setBalance($data['Balance']);
            }

            public function supportsDenormalization(mixed $data, string $type, ?string $format = null, array $context = []): bool
            {
                return $type === RevolutStatementRow::class && is_array($data);
            }

            public function getSupportedTypes(?string $format): array
            {
                return [
                    RevolutStatementRow::class => true,
                ];
            }
        };
    }
}
