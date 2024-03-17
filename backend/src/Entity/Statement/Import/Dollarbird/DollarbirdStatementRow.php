<?php

namespace App\Entity\Statement\Import\Dollarbird;

use App\Entity\Statement\Import\StatementImportRowInterface;
use DateTime;
use DateTimeInterface;
use Symfony\Component\Serializer\Annotation\SerializedName;

class DollarbirdStatementRow implements StatementImportRowInterface
{
    private DateTime $date;

    private float $value;

    private string $label;

    private bool $confirmed;

    #[SerializedName('Category')]
    private string $categoryName;

    private ?string $description;

    private string $ownerName;

    private string $ownerEmail;

    private ?string $receipt;

    public function getDate(): DateTimeInterface
    {
        return $this->date;
    }

    public function setDate(DateTime $date): self
    {
        $this->date = $date;

        return $this;
    }

    public function getValue(): float
    {
        return $this->value;
    }

    public function setValue(float $value): self
    {
        $this->value = $value;

        return $this;
    }

    public function getLabel(): string
    {
        return $this->label;
    }

    public function setLabel(string $label): self
    {
        $this->label = $label;

        return $this;
    }

    public function isConfirmed(): bool
    {
        return $this->confirmed;
    }

    public function setConfirmed(bool $confirmed): self
    {
        $this->confirmed = $confirmed;

        return $this;
    }

    public function getCategoryName(): ?string
    {
        return $this->categoryName === 'Uncategorized' ? null : $this->categoryName;
    }

    public function setCategoryName(string $categoryName): self
    {
        $this->categoryName = $categoryName;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description ?: null;
    }

    public function setDescription(?string $description): self
    {
        $this->description = $description;

        return $this;
    }

    public function getOwnerName(): string
    {
        return $this->ownerName;
    }

    public function setOwnerName(string $ownerName): self
    {
        $this->ownerName = $ownerName;

        return $this;
    }

    public function getOwnerEmail(): string
    {
        return $this->ownerEmail;
    }

    public function setOwnerEmail(string $ownerEmail): self
    {
        $this->ownerEmail = $ownerEmail;

        return $this;
    }

    public function getReceipt(): ?string
    {
        return $this->receipt;
    }

    public function setReceipt(?string $receipt): self
    {
        $this->receipt = $receipt;

        return $this;
    }

    public function getStatementId(): string
    {
        $arr = [
            'Date' => $this->getDate(),
            'Value' => $this->getValue(),
            'Label' => $this->getLabel(),
            'Category' => $this->getCategoryName(),
            'Description' => $this->getDescription(),
            'Owner Name' => $this->getOwnerName(),
            'Owner Email' => $this->getOwnerEmail(),
        ];

        return md5(json_encode($arr, JSON_THROW_ON_ERROR));
    }

    public function getAmount(): float
    {
        return $this->value;
    }

    public function getCreatedAt(): DateTime
    {
        return $this->date;
    }

    public function getIdentification(): ?string
    {
        return null;
    }

    public function getStatementHash(): string
    {
        return 'DOLLARBIRD_'.$this->getStatementId();
    }
}