<?php

declare(strict_types=1);

namespace App\Request\Auth;

use App\Const\AssertConst;
use App\Request\AbstractRequest;
use Symfony\Component\Validator\Constraints as Assert;

class RegistrationRequest extends AbstractRequest
{
    #[Assert\NotBlank]
    #[Assert\Email]
    #[Assert\Length(max: AssertConst::MAX_STRING_LENGTH)]
    private string $email;

    #[Assert\NotBlank]
    #[Assert\Length(min: AssertConst::MIN_PASSWORD_LENGTH, max: AssertConst::MAX_STRING_LENGTH)]
    private string $password;

    #[Assert\NotBlank]
    #[Assert\Length(min: AssertConst::MIN_PASSWORD_LENGTH, max: AssertConst::MAX_STRING_LENGTH)]
    private string $confirmPassword;

    #[Assert\NotBlank]
    #[Assert\Length(min: 4, max: AssertConst::MAX_STRING_LENGTH)]
    private string $fullName;

    #[Assert\IsTrue(message: AssertConst::MSG_PASSWORD_MISMATCH)]
    public function isPasswordMatch(): bool
    {
        return $this->getPassword() === $this->getConfirmPassword();
    }

    public function getEmail(): string
    {
        return $this->email;
    }

    public function setEmail(string $email): void
    {
        $this->email = $email;
    }

    public function getPassword(): string
    {
        return $this->password;
    }

    public function setPassword(string $password): void
    {
        $this->password = $password;
    }

    public function getFullName(): string
    {
        return $this->fullName;
    }

    public function setFullName(string $fullName): self
    {
        $this->fullName = $fullName;

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
