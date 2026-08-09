<?php

declare(strict_types=1);

namespace App\DTO\Statement\Import\Ofx;

use App\DTO\Statement\Import\StatementImportRowInterface;
use DateTime;
use InvalidArgumentException;

class OfxStatementRow implements StatementImportRowInterface
{
    private ?string $trnType = null;
    private DateTime $datePosted;
    private float $amount = 0;
    private ?string $fitId = null;
    private ?string $name = null;
    private ?string $memo = null;

    /**
     * @param array{trnType: ?string, datePosted: ?string, amount: ?string, fitId: ?string, name: ?string, memo: ?string} $transaction
     */
    public static function fromTransaction(array $transaction): self
    {
        return (new self())
            ->setTrnType($transaction['trnType'])
            ->setDatePosted($transaction['datePosted'])
            ->setAmount($transaction['amount'])
            ->setFitId($transaction['fitId'])
            ->setName($transaction['name'])
            ->setMemo($transaction['memo']);
    }

    public function getTrnType(): ?string
    {
        return $this->trnType;
    }

    public function setTrnType(?string $trnType): self
    {
        $this->trnType = $trnType !== null ? trim($trnType) : null;

        return $this;
    }

    public function getDatePosted(): DateTime
    {
        return $this->datePosted;
    }

    public function setDatePosted(?string $datePosted): self
    {
        if ($datePosted === null) {
            throw new InvalidArgumentException('OFX transaction is missing DTPOSTED.');
        }

        // OFX datetime: YYYYMMDDHHMMSS.XXX[gmt offset:tz name], e.g. 19961005132207.124[-5:EST].
        // Timezone and fractional seconds are dropped; the bank-local date/time is kept,
        // consistent with other statement handlers.
        $value = preg_replace('/\[.*$/', '', trim($datePosted)) ?? '';
        $value = preg_replace('/\..*$/', '', $value) ?? '';
        $digits = preg_replace('/\D/', '', $value) ?? '';

        if (strlen($digits) < 8) {
            throw new InvalidArgumentException(sprintf('Unparseable OFX DTPOSTED value: "%s".', $datePosted));
        }

        $digits = substr(str_pad($digits, 14, '0'), 0, 14);

        $date = DateTime::createFromFormat('YmdHis', $digits);
        if ($date === false) {
            throw new InvalidArgumentException(sprintf('Unparseable OFX DTPOSTED value: "%s".', $datePosted));
        }

        $this->datePosted = $date;

        return $this;
    }

    public function getAmount(): float
    {
        return $this->amount;
    }

    public function setAmount(float|int|string|null $amount): self
    {
        if ($amount === null) {
            throw new InvalidArgumentException('OFX transaction is missing TRNAMT.');
        }

        // OFX uses "." as decimal separator; strip grouping separators defensively.
        $this->amount = (float) str_replace([',', ' '], '', (string) $amount);

        return $this;
    }

    public function getFitId(): ?string
    {
        return $this->fitId;
    }

    public function setFitId(?string $fitId): self
    {
        $this->fitId = $fitId !== null ? trim($fitId) : null;

        return $this;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(?string $name): self
    {
        $this->name = $name !== null ? trim($name) : null;

        return $this;
    }

    public function getMemo(): ?string
    {
        return $this->memo;
    }

    public function setMemo(?string $memo): self
    {
        $this->memo = $memo !== null ? trim($memo) : null;

        return $this;
    }

    public function getLabel(): string
    {
        return $this->name ?? $this->memo ?? 'Unknown';
    }

    public function getCreatedAt(): DateTime
    {
        return $this->getDatePosted();
    }

    public function isConfirmed(): bool
    {
        // OFX statement transactions are posted (completed) by definition.
        return true;
    }

    public function getCategoryName(): ?string
    {
        return null;
    }

    public function getDescription(): ?string
    {
        if ($this->memo === null || $this->memo === '' || $this->memo === $this->getLabel()) {
            return null;
        }

        return $this->memo;
    }
}
