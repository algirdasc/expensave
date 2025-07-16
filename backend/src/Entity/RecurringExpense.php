<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Repository\RecurringExpenseRepository;

#[ORM\Entity(repositoryClass: RecurringExpenseRepository::class)]
class RecurringExpense
{
    #[ORM\Id, ORM\GeneratedValue, ORM\Column(type: "integer")]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: User::class)]
    private User $user;

    #[ORM\ManyToOne(targetEntity: Calendar::class)]
    private Calendar $calendar;

    #[ORM\Column(type: "string")]
    private string $label;

    #[ORM\Column(type: "float")]
    private float $amount;

    #[ORM\ManyToOne(targetEntity: Category::class)]
    private ?Category $category = null;

    #[ORM\Column(type: "date")]
    private \DateTime $startDate;

    #[ORM\Column(type: "string", length: 16)]
    private string $interval; // e.g. "daily", "weekly", "monthly"

    #[ORM\Column(type: "date", nullable: true)]
    private ?\DateTime $endDate = null;

    #[ORM\Column(type: "boolean")]
    private bool $isActive = true;

    // Add here the getters and setters as needed
}
