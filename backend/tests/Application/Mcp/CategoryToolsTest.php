<?php

declare(strict_types=1);

namespace App\Tests\Application\Mcp;

use App\Mcp\CategoryTools;
use PHPUnit\Framework\Attributes\CoversClass;

#[CoversClass(CategoryTools::class)]
class CategoryToolsTest extends McpTestCase
{
    public function testListCategories(): void
    {
        $categories = $this->callMcpToolForContent($this->getMcpClient(), 'list-categories');

        $indexed = $this->indexBy($categories, 'name');

        $this->assertArrayHasKey('Category 1', $indexed);
        $this->assertArrayHasKey('Category 2', $indexed);
        $this->assertArrayHasKey('Uncategorized', $indexed);
        $this->assertArrayNotHasKey('Balance Update', $indexed);

        $this->assertSame('user', $indexed['Category 1']['type']);
        $this->assertSame('uncategorized', $indexed['Uncategorized']['type']);
        $this->assertSame(['Category 1', 'Category 2', 'Uncategorized'], array_column($categories, 'name'));
    }

    public function testGetCategory(): void
    {
        $category = $this->callMcpToolForContent($this->getMcpClient(), 'get-category', [
            'categoryId' => $this->getCategoryId('Category 1'),
        ]);

        $this->assertSame('Category 1', $category['name']);
        $this->assertSame('#00ff00', $category['color']);
    }

    public function testGetMissingCategoryFails(): void
    {
        $result = $this->callMcpTool($this->getMcpClient(), 'get-category', ['categoryId' => 999999]);

        $this->assertTrue($result['isError']);
        $this->assertStringContainsString('not found', $result['content'][0]['text']);
    }
}
