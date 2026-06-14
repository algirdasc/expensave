<?php

declare(strict_types=1);

namespace App\Tests\Application\Handler\Error;

use App\Exception\DataConflictException;
use App\Handler\Error\DataConflictHandler;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\TestCase;
use RuntimeException;
use Symfony\Component\HttpFoundation\Response;

#[CoversClass(DataConflictHandler::class)]
#[CoversClass(DataConflictException::class)]
class DataConflictHandlerTest extends TestCase
{
    public function testSupportsDataConflictException(): void
    {
        $handler = new DataConflictHandler();

        $this->assertTrue($handler->isSupported(new DataConflictException('Conflict')));
        $this->assertFalse($handler->isSupported(new RuntimeException('Other failure')));
    }

    public function testMapsDataConflictToConflictResponse(): void
    {
        $handler = (new DataConflictHandler())
            ->setThrowable(new DataConflictException('Cannot delete this category.', 'category'));

        $messages = $handler->getMessages();

        $this->assertSame(Response::HTTP_CONFLICT, $handler->getStatusCode());
        $this->assertSame('Cannot delete this category.', $messages[0]->getMessage());
        $this->assertSame('category', $messages[0]->getPropertyPath());
    }
}
