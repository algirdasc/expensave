<?php

namespace App\Entity;

use App\Const\ContextGroupConst;
use App\Enum\CategoryType;
use App\Repository\CategoryRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @codeCoverageIgnore
 */
#[ORM\Entity(repositoryClass: CategoryRepository::class)]
#[UniqueEntity(['name'])]
class Category
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(ContextGroupConst::API_ALL)]
    private ?int $id = null;

    #[ORM\Column(unique: true)]
    #[Groups(ContextGroupConst::API_ALL)]
    private string $name;

    #[ORM\Column(length: 8)]
    #[Groups(ContextGroupConst::API_ALL)]
    private string $color;

    #[ORM\Column]
    #[Groups(ContextGroupConst::API_ALL)]
    private CategoryType $type = CategoryType::USER;

    /**
     * @var Collection<array-key, CategoryRule>
     */
    #[ORM\OneToMany(targetEntity: CategoryRule::class, mappedBy: 'category')]
    private Collection $rules;

    public function __construct()
    {
        $this->rules = new ArrayCollection();
    }

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

    public function getColor(): string
    {
        return $this->color;
    }

    public function setColor(string $color): self
    {
        $this->color = $color;

        return $this;
    }

    /**
     * @return Collection<array-key, CategoryRule>
     */
    public function getRules(): Collection
    {
        return $this->rules;
    }

    public function addRule(CategoryRule $rule): self
    {
        if (!$this->rules->contains($rule)) {
            $this->rules->add($rule);
        }

        return $this;
    }

    public function removeRule(CategoryRule $rule): self
    {
        $this->rules->removeElement($rule);

        return $this;
    }

    public function getType(): CategoryType
    {
        return $this->type;
    }

    public function setType(CategoryType $type): self
    {
        $this->type = $type;

        return $this;
    }

    // TODO: rename to isReadonly
    #[Groups(ContextGroupConst::API_ALL)]
    public function isDefinedByUser(): bool
    {
        return $this->type === CategoryType::USER;
    }
}
