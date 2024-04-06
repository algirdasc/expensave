<?php

declare(strict_types=1);

namespace App\Request\User;

use App\Const\AssertConst;
use App\Request\AbstractRequest;
use Symfony\Component\Validator\Constraints as Assert;

class PasswordChangeRequest extends AbstractRequest
{
    #[Assert\NotBlank]
    private string $currentPassword;

    #[Assert\NotBlank]
    #[Assert\Length(min: AssertConst::MIN_PASSWORD_LENGTH, max: AssertConst::MAX_STRING_LENGTH)]
    private string $newPassword;

    #[Assert\NotBlank]
    #[Assert\Length(min: AssertConst::MIN_PASSWORD_LENGTH, max: AssertConst::MAX_STRING_LENGTH)]
    private string $confirmPassword;

    #[Assert\IsTrue(message: AssertConst::MSG_PASSWORD_MISMATCH)]
    public function isPasswordMatch(): bool
    {
        return $this->getNewPassword() === $this->getConfirmPassword();
    }

    public function getCurrentPassword(): string
    {
        return $this->currentPassword;
    }

    public function setCurrentPassword(string $currentPassword): self
    {
        $this->currentPassword = $currentPassword;

        return $this;
    }

    public function getNewPassword(): string
    {
        return $this->newPassword;
    }

    public function setNewPassword(string $newPassword): self
    {
        $this->newPassword = $newPassword;

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