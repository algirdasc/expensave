<?php

declare(strict_types=1);

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Const\ContextGroupConst;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity]
#[UniqueEntity(['identification'])]
class CalendarIdentification
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(ContextGroupConst::API_ALL)]
    private ?int $id = null;

    #[ORM\Column]
    private string $name;

    #[ORM\Column(unique: true)]
    #[Groups(ContextGroupConst::API_ALL)]
    private string $identification;

    #[ORM\ManyToOne(targetEntity: Calendar::class, inversedBy: 'identifications')]
    private Calendar $calendar;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(?int $id): self
    {
        $this->id = $id;

        return $this;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getIdentification(): string
    {
        return $this->identification;
    }

    public function setIdentification(string $identification): self
    {
        $this->identification = $identification;

        return $this;
    }

    public function getCalendar(): Calendar
    {
        return $this->calendar;
    }

    public function setCalendar(Calendar $calendar): self
    {
        $this->calendar = $calendar;

        return $this;
    }
}
