<?php

declare(strict_types=1);

namespace App\Entity\Statement\Import\Revolut;

use App\Entity\Statement\Import\StatementImportRowInterface;
use DateTime;
use Symfony\Component\Serializer\Annotation\SerializedName;

class RevolutStatementRow implements StatementImportRowInterface
{
    private TypeEnum $type;
    private string $product;

    #[SerializedName('Started Date')]
    private DateTime $startedDate;

    #[SerializedName('Completed Date')]
    private DateTime $completedDate;
    private string $description;
    private float $amount;
    private float $fee;
    private string $currency;
    private StateEnum $state;
    private float $balance;

    private ?string $statementId = null;

    public function getType(): TypeEnum
    {
        return $this->type;
    }

    public function setType(TypeEnum $type): self
    {
        $this->type = $type;

        return $this;
    }

    public function getProduct(): string
    {
        return $this->product;
    }

    public function setProduct(string $product): self
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

    public function getCompletedDate(): DateTime
    {
        return $this->completedDate;
    }

    public function setCompletedDate(DateTime $completedDate): self
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

    public function setFee(float|int $fee): self
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

    public function setBalance(float|int|null $balance): self
    {
        $this->balance = (float) $balance;

        return $this;
    }

    public function setAmount(float|int $amount): self
    {
        $this->amount = (float) $amount;

        return $this;
    }

    public function getStatementId(): string
    {
        if ($this->statementId === null) {

            $arr = [
                'Type' => $this->getType(),
                'Product' => $this->getProduct(),
                'StartedDate' => $this->getStartedDate(),
                'CompletedDate' => $this->getCompletedDate(),
                'Amount' => $this->amount,
                'Fee' => $this->getFee(),
                'Currency' => $this->getCurrency(),
                'Balance' => $this->getBalance(),
            ];

            $this->statementId = md5(json_encode($arr, JSON_THROW_ON_ERROR));

            if ($this->statementId === '8a17120b2abd12d940dad76de5ed4a0a') {
                $a = 0;
            }
        }

        return $this->statementId;
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

    public function getIdentification(): ?string
    {
        return null;
    }

    public function getStatementHash(): string
    {
        return 'REVOLUT_'.$this->getType()->value.'_'.$this->getStatementId();
    }

    public function isConfirmed(): bool
    {
        return $this->getState() === StateEnum::COMPLETED;
    }

    public function getCategoryName(): ?string
    {
        return null;
    }
}
