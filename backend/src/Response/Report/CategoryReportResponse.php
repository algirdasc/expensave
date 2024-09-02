<?php

declare(strict_types=1);

namespace App\Response\Report;

use App\Const\ContextGroupConst;
use App\DTO\Report\BalanceMeta;
use App\DTO\Report\CategoryBalance;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @codeCoverageIgnore
 */
readonly class CategoryReportResponse
{
    /**
     * @param array<CategoryBalance> $categoryBalances
     */
    public function __construct(
        private array $categoryBalances,
        private BalanceMeta $meta,
    ) {
    }

    /**
     * @return array<CategoryBalance>
     */
    #[Groups(ContextGroupConst::API_ALL)]
    public function getCategoryBalances(): array
    {
        return $this->categoryBalances;
    }

    #[Groups(ContextGroupConst::API_ALL)]
    public function getMeta(): BalanceMeta
    {
        return $this->meta;
    }
}