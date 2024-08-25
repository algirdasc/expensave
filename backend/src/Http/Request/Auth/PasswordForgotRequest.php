<?php

declare(strict_types=1);

namespace App\Http\Request\Auth;

use App\Const\AssertConst;
use App\Http\Request\AbstractRequest;
use Symfony\Component\Validator\Constraints as Assert;

class PasswordForgotRequest extends AbstractRequest
{
    #[Assert\NotBlank]
    #[Assert\Email]
    #[Assert\Length(max: AssertConst::MAX_STRING_LENGTH)]
    private string $email;

    public function getEmail(): string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }
}
