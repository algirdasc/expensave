<?php

declare(strict_types=1);

namespace App\Tests\Application\Service\StatementImport\Resolver;

use App\Exception\UnsupportedStatementFileException;
use App\Service\StatementImport\Handler\StatementImportHandlerInterface;
use App\Service\StatementImport\Resolver\StatementImportResolver;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\TestCase;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\Response;

#[CoversClass(StatementImportResolver::class)]
class StatementImportResolverTest extends TestCase
{
    public function testGetHandlerReturnsSupportingHandler(): void
    {
        $supported = $this->createStub(StatementImportHandlerInterface::class);
        $supported->method('supports')->willReturn(true);

        $resolver = new StatementImportResolver([$supported]);

        self::assertSame($supported, $resolver->getHandler($this->createStub(UploadedFile::class)));
    }

    public function testGetHandlerThrowsWhenNoHandlerSupportsFile(): void
    {
        $unsupported = $this->createStub(StatementImportHandlerInterface::class);
        $unsupported->method('supports')->willReturn(false);

        $resolver = new StatementImportResolver([$unsupported]);

        try {
            $resolver->getHandler($this->createStub(UploadedFile::class));
            self::fail('Expected ' . UnsupportedStatementFileException::class);
        } catch (UnsupportedStatementFileException $exception) {
            self::assertSame(Response::HTTP_UNSUPPORTED_MEDIA_TYPE, $exception->getStatusCode());
        }
    }
}
