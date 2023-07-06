<?php

namespace App\Tests\Service;

use App\Service\ValidationService;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Validator\Validator\ValidatorInterface;

/**
 * Class ValidationServiceTest.
 *
 * @covers \App\Service\ValidationService
 */
final class ValidationServiceTest extends TestCase
{
    private ValidationService $validationService;

    private ValidatorInterface|MockObject $validator;

    /**
     * {@inheritdoc}
     */
    protected function setUp(): void
    {
        parent::setUp();

        $this->validator = $this->createMock(ValidatorInterface::class);
        $this->validationService = new ValidationService($this->validator);
    }

    /**
     * {@inheritdoc}
     */
    protected function tearDown(): void
    {
        parent::tearDown();

        unset($this->validationService);
        unset($this->validator);
    }

    public function testValidateOrException(): void
    {
        /** @todo This test is incomplete. */
        $this->markTestIncomplete();
    }
}
