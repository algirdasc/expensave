<?php

declare(strict_types=1);

namespace App\Tests\Application\Handler\Error;

use App\Exception\UnhandledException;
use App\Handler\Error\UnhandledExceptionHandler;
use PDOException;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\TestCase;
use Symfony\Component\HttpFoundation\Response;

#[CoversClass(UnhandledExceptionHandler::class)]
class UnhandledExceptionHandlerTest extends TestCase
{
    public function testDebugModeExposesExceptionDetails(): void
    {
        $throwable = new PDOException('SQLSTATE[HY000] connection refused');

        $handler = (new UnhandledExceptionHandler(true))->setThrowable($throwable);

        $this->assertSame($throwable, $handler->getThrowable());
        $this->assertSame(Response::HTTP_INTERNAL_SERVER_ERROR, $handler->getStatusCode());

        $message = $handler->getMessages()[0];
        $this->assertSame('SQLSTATE[HY000] connection refused', $message->getMessage());
        $this->assertSame($throwable->getFile(), $message->getFile());
        $this->assertSame($throwable->getLine(), $message->getLine());
        $this->assertNotEmpty($message->getTrace());
    }

    public function testProdModeHidesExceptionDetails(): void
    {
        $handler = (new UnhandledExceptionHandler(false))
            ->setThrowable(new PDOException('SQLSTATE[HY000] connection refused'));

        $this->assertInstanceOf(UnhandledException::class, $handler->getThrowable());

        $message = $handler->getMessages()[0];
        $this->assertSame('Internal server error.', $message->getMessage());
        $this->assertNull($message->getFile());
        $this->assertNull($message->getLine());
        $this->assertNull($message->getTrace());
    }

    public function testProdModeIsTheDefault(): void
    {
        $handler = (new UnhandledExceptionHandler())
            ->setThrowable(new PDOException('SQLSTATE[HY000] connection refused'));

        $this->assertSame('Internal server error.', $handler->getMessages()[0]->getMessage());
    }
}
