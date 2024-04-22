<?php

declare(strict_types=1);

namespace App\Request\Calendar;

use App\Const\AssertConst;
use App\Entity\User;
use App\Request\AbstractRequest;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\Validator\Constraints as Assert;

class CreateCalendarRequest extends AbstractRequest
{
    #[Assert\NotBlank]
    #[Assert\Length(max: AssertConst::MAX_STRING_LENGTH)]
    protected string $name;

    /**
     * @var Collection<User>|null
     */
    protected ?Collection $collaborators = null;

    public function getName(): string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    /**
     * @return Collection<User>
     */
    public function getCollaborators(): Collection
    {
        return $this->collaborators ?? new ArrayCollection();
    }

    /**
     * @param Collection<User>|null $collaborators
     */
    public function setCollaborators(?Collection $collaborators): self
    {
        $this->collaborators = $collaborators;

        return $this;
    }
}
