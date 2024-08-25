<?php

declare(strict_types=1);

namespace App\Http\Request\Auth;

use App\Const\AssertConst;
use App\Http\Request\AbstractRequest;
use Symfony\Component\Validator\Constraints as Assert;

class PasswordResetRequest extends AbstractRequest
{
    #[Assert\NotBlank]
    private string $hash;

    #[Assert\NotBlank]
    #[Assert\Length(min: AssertConst::MIN_PASSWORD_LENGTH, max: AssertConst::MAX_STRING_LENGTH)]
    private string $password;

    #[Assert\NotBlank]
    #[Assert\Length(min: AssertConst::MIN_PASSWORD_LENGTH, max: AssertConst::MAX_STRING_LENGTH)]
    private string $confirmPassword;

    #[Assert\IsTrue(message: AssertConst::MSG_PASSWORD_MISMATCH)]
    public function isPasswordMatch(): bool
    {
        return $this->getPassword() === $this->getConfirmPassword();
    }

    public function getHash(): string
    {
        return $this->hash;
    }

    public function setHash(string $hash): self
    {
        $this->hash = $hash;

        return $this;
    }

    public function getPassword(): string
    {
        return $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    public function getConfirmPassword(): string
    {
        return $this->confirmPassword;
    }

    public function setConfirmPassword(string $confirmPassword): self
    {
        $this->confirmPassword = $confirmPassword;

        return $this;
    }
}
