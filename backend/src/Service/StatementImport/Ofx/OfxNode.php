<?php

declare(strict_types=1);

namespace App\Service\StatementImport\Ofx;

final class OfxNode
{
    /** @var array<string, list<string>> */
    private array $values = [];

    /** @var array<string, list<OfxNode>> */
    private array $children = [];

    public function __construct(
        public readonly string $name,
    ) {
    }

    public function addValue(string $name, string $value): void
    {
        $this->values[$name][] = $value;
    }

    public function addChild(self $node): void
    {
        $this->children[$node->name][] = $node;
    }

    public function firstValue(string $name): ?string
    {
        return $this->values[$name][0] ?? null;
    }

    /**
     * Depth-first iteration over this node and all descendants.
     *
     * @return iterable<OfxNode>
     */
    public function walk(): iterable
    {
        yield $this;

        foreach ($this->children as $nodes) {
            foreach ($nodes as $node) {
                yield from $node->walk();
            }
        }
    }
}
