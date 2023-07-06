<?php

declare(strict_types=1);

namespace App\Entity\Statement\Import\ISO20022;

use App\Entity\Statement\Import\StatementImportRowInterface;
use App\Entity\Statement\Import\ISO20022\Ntry\BookgDt;
use App\Entity\Statement\Import\ISO20022\Ntry\CdtDbtInd;
use App\Entity\Statement\Import\ISO20022\Ntry\NtryDtls;
use App\Entity\Statement\Import\ISO20022\Ntry\ValDt;
use DateTime;
use Symfony\Component\Serializer\Encoder\XmlEncoder;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;

class Ntry implements StatementImportRowInterface
{
    private Amt $amt;
    private CdtDbtInd $cdtDbtInd;
    private BookgDt $bookgDt;
    private ValDt $valDt;

    /**
     * @var array<NtryDtls>
     */
    private array $ntryDtls = [];
    private Stmt $stmt;

    public function getAmt(): Amt
    {
        return $this->amt;
    }

    public function setAmt(Amt $amt): self
    {
        $this->amt = $amt;

        return $this;
    }

    public function getCdtDbtInd(): CdtDbtInd
    {
        return $this->cdtDbtInd;
    }

    public function setCdtDbtInd(CdtDbtInd $cdtDbtInd): self
    {
        $this->cdtDbtInd = $cdtDbtInd;

        return $this;
    }

    public function getBookgDt(): BookgDt
    {
        return $this->bookgDt;
    }

    public function setBookgDt(BookgDt $bookgDt): self
    {
        $this->bookgDt = $bookgDt;

        return $this;
    }

    public function getValDt(): ValDt
    {
        return $this->valDt;
    }

    public function setValDt(ValDt $valDt): self
    {
        $this->valDt = $valDt;

        return $this;
    }

    /**
     * @return array<NtryDtls>
     */
    public function getNtryDtls(): array
    {
        return $this->ntryDtls;
    }

    /**
     * @param array<NtryDtls> $ntryDtls
     */
    public function setNtryDtls(array $ntryDtls): self
    {
        $this->ntryDtls = $ntryDtls;

        return $this;
    }

    public function getStmt(): Stmt
    {
        return $this->stmt;
    }

    public function setStmt(Stmt $stmt): self
    {
        $this->stmt = $stmt;

        return $this;
    }

    public function getEntryDetails(): ?NtryDtls
    {
        return $this->getNtryDtls()[0] ?? null;
    }

    public function getStatementId(): string
    {
        $refs = $this->getEntryDetails()?->getTxDetails()?->getRefs();

        $statementId = $refs?->getAcctSvcrRef() ?? $refs?->getTxId() ?? $refs?->getInstrId();

        if ($statementId === null) {
            $serializer = new Serializer([new ObjectNormalizer()], [new XmlEncoder()]);
            $innerXml = $serializer->serialize($this->getNtryDtls(), XmlEncoder::FORMAT);

            $statementId = md5($innerXml);
        }

        return $statementId;
    }

    public function getLabel(): string
    {
        $relatedParty = match ($this->cdtDbtInd) {
            CdtDbtInd::DBIT => $this->getEntryDetails()?->getTxDetails()?->getRltdPties()?->getCdtr(),
            CdtDbtInd::CRDT => $this->getEntryDetails()?->getTxDetails()?->getRltdPties()?->getDbtr(),
        };

        return implode(' - ', array_filter([$relatedParty, (string) ($this->getEntryDetails()?->getTxDetails()?->getRmtInf() ?? 'No remittance information provided')]));
    }

    public function getAmount(): float
    {
        return match ($this->getCdtDbtInd()) {
            CdtDbtInd::DBIT => -$this->getAmt()->getAmount(),
            CdtDbtInd::CRDT => $this->getAmt()->getAmount(),
        };
    }

    public function getCreatedAt(): DateTime
    {
        return $this->getValDt()->getDateTime() ?? $this->getBookgDt()->getDateTime() ?? new DateTime();
    }

    public function getIdentification(): string
    {
        return (string) $this->getStmt()->getAcct()->getId();
    }

    public function getStatementHash(): string
    {
        return $this->getIdentification().'_'.$this->getStatementId();
    }

    public function isConfirmed(): bool
    {
        return true;
    }
}
