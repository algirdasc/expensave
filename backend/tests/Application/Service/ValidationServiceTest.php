<?php

declare(strict_types=1);

namespace App\Tests\Application\Service;

use App\Exception\RequestValidationException;
use App\Service\ValidationService;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\TestCase;
use stdClass;
use Symfony\Component\Validator\ConstraintViolation;
use Symfony\Component\Validator\ConstraintViolationList;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[CoversClass(ValidationService::class)]
class ValidationServiceTest extends TestCase
{
    public function testValidateOrExceptionDoesNothingWhenNoViolations(): void
    {
        $validator = $this->createMock(ValidatorInterface::class);
        $validator
            ->expects($this->once())
            ->method('validate')
            ->with($this->isInstanceOf(stdClass::class))
            ->willReturn(new ConstraintViolationList());

        $service = new ValidationService($validator);
        $service->validateOrException(new stdClass());

        $this->assertTrue(true); // explicit: no exception
    }

    public function testValidateOrExceptionThrowsWhenViolationsExist(): void
    {
        $violations = new ConstraintViolationList([
            new ConstraintViolation(
                'Bad value',
                null,
                [],
                null,
                'field',
                'x'
            ),
        ]);

        $validator = $this->createMock(ValidatorInterface::class);
        $validator
            ->expects($this->once())
            ->method('validate')
            ->willReturn($violations);

        $service = new ValidationService($validator);

        $this->expectException(RequestValidationException::class);
        $service->validateOrException(new stdClass());
    }
}
