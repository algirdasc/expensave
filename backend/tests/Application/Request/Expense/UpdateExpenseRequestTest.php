<?php

declare(strict_types=1);

namespace App\Tests\Application\Request\Expense;

use App\Enum\RecurringExpenseUpdateScope;
use App\Request\Expense\UpdateExpenseRequest;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\TestCase;
use Symfony\Component\HttpFoundation\RequestStack;

#[CoversClass(UpdateExpenseRequest::class)]
class UpdateExpenseRequestTest extends TestCase
{
    public function testDefaultsRecurringScopeToThisWhenOmitted(): void
    {
        $request = new UpdateExpenseRequest([], new RequestStack());

        $this->assertSame(RecurringExpenseUpdateScope::THIS, $request->getRecurringUpdateScope());
    }
}
