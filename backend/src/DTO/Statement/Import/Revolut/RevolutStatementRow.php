<?php

declare(strict_types=1);

namespace App\DTO\Statement\Import\Revolut;

use App\DTO\Statement\Import\StatementImportRowInterface;
use DateTime;
use Symfony\Component\Serializer\Annotation\SerializedName;

class RevolutStatementRow implements StatementImportRowInterface
{
    private TypeEnum $type;
    private ProductEnum $product;

    #[SerializedName('Started Date')]
    private DateTime $startedDate;

    #[SerializedName('Completed Date')]
    private ?DateTime $completedDate;
    private string $description;
    private float $amount;
    private float $fee;
    private string $currency;
    private StateEnum $state;
    private float $balance;

    public function getType(): TypeEnum
    {
        return $this->type;
    }

    public function setType(TypeEnum $type): self
    {
        $this->type = $type;

        return $this;
    }

    public function getProduct(): ProductEnum
    {
        return $this->product;
    }

    public function setProduct(ProductEnum $product): self
    {
        $this->product = $product;

        return $this;
    }

    public function getStartedDate(): DateTime
    {
        return $this->startedDate;
    }

    public function setStartedDate(DateTime $startedDate): self
    {
        $this->startedDate = $startedDate;

        return $this;
    }

    public function getCompletedDate(): ?DateTime
    {
        return $this->completedDate;
    }

    public function setCompletedDate(?DateTime $completedDate): self
    {
        $this->completedDate = $completedDate;

        return $this;
    }

    public function getDescription(): string
    {
        return $this->description;
    }

    public function setDescription(string $description): self
    {
        $this->description = $description;

        return $this;
    }

    public function getFee(): float
    {
        return $this->fee;
    }

    public function setFee(float|int|string $fee): self
    {
        $this->fee = (float) $fee;

        return $this;
    }

    public function getCurrency(): string
    {
        return $this->currency;
    }

    public function setCurrency(string $currency): self
    {
        $this->currency = $currency;

        return $this;
    }

    public function getState(): StateEnum
    {
        return $this->state;
    }

    public function setState(StateEnum $state): self
    {
        $this->state = $state;

        return $this;
    }

    public function getBalance(): float
    {
        return $this->balance;
    }

    public function setBalance(float|int|string|null $balance): self
    {
        $this->balance = (float) $balance;

        return $this;
    }

    public function setAmount(float|int|string $amount): self
    {
        $this->amount = (float) $amount;

        return $this;
    }

    public function getLabel(): string
    {
        return $this->getDescription();
    }

    public function getAmount(): float
    {
        return $this->amount - $this->getFee();
    }

    public function getCreatedAt(): DateTime
    {
        return $this->getStartedDate();
    }

    public function isConfirmed(): bool
    {
        return $this->getState() === StateEnum::COMPLETED;
    }

    public function getCategoryName(): ?string
    {
        return null;
    }

    public function getImportHash(): string
    {
        $keys = [
            'startedDate' => $this->startedDate,
            'description' => $this->description,
            'amount' => $this->amount,
            'currency' => $this->currency,
        ];

        return 'REVOLUT_' . md5(serialize($keys));
    }
}
