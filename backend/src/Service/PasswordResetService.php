<?php

declare(strict_types=1);

namespace App\Service;

use App\Exception\RequestValidationException;
use App\Repository\UserRepository;
use DateTimeImmutable;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\Validator\ConstraintViolation;
use Symfony\Component\Validator\ConstraintViolationList;

readonly class PasswordResetService
{
    private const int RESET_TOKEN_TTL_HOURS = 1;
    private const string INVALID_RESET_TOKEN_MESSAGE = 'Password reset link is invalid or expired.';

    public function __construct(
        private UserRepository $userRepository,
        private MailerInterface $mailer,
        #[Autowire('%frontendUrl%')] private string $frontendUrl,
        #[Autowire('%mailerFrom%')] private string $mailerFrom,
    ) {
    }

    public function forgotPassword(string $email): void
    {
        $user = $this->userRepository->findOneBy(['email' => $email, 'active' => true]);

        if ($user === null) {
            return;
        }

        $token = bin2hex(random_bytes(32));
        $user
            ->setPasswordResetToken(self::hashToken($token))
            ->setPasswordResetTokenExpiresAt(new DateTimeImmutable(sprintf('+%d hour', self::RESET_TOKEN_TTL_HOURS)))
        ;

        $this->userRepository->save($user);

        $this->mailer->send(
            (new Email())
                ->from($this->mailerFrom)
                ->to($user->getEmail())
                ->subject('Reset your Expensave password')
                ->text(sprintf(
                    "Use this link to reset your Expensave password:\n\n%s\n\nThis link expires in %d hour.",
                    $this->createResetLink($token),
                    self::RESET_TOKEN_TTL_HOURS
                ))
                ->html(sprintf(
                    '<p>Use this link to reset your Expensave password:</p><p><a href="%1$s">%1$s</a></p><p>This link expires in %2$d hour.</p>',
                    htmlspecialchars($this->createResetLink($token), ENT_QUOTES),
                    self::RESET_TOKEN_TTL_HOURS
                ))
        );
    }

    public function resetPassword(string $hash, string $password): void
    {
        $hashedToken = self::hashToken($hash);
        $user = $this->userRepository->findOneBy(['passwordResetToken' => $hashedToken, 'active' => true]);

        if ($user === null || !$user->hasValidPasswordResetToken($hashedToken, new DateTimeImmutable())) {
            throw new RequestValidationException(new ConstraintViolationList([
                new ConstraintViolation(
                    self::INVALID_RESET_TOKEN_MESSAGE,
                    null,
                    [],
                    null,
                    'hash',
                    $hash,
                ),
            ]));
        }

        $user
            ->setPlainPassword($password)
            ->clearPasswordResetToken()
        ;

        $this->userRepository->save($user);
    }

    // sha256 suffices: 256-bit random tokens have no password-guessing surface.
    private static function hashToken(string $token): string
    {
        return hash('sha256', $token);
    }

    private function createResetLink(string $token): string
    {
        return sprintf('%s/auth/reset-password?hash=%s', rtrim($this->frontendUrl, '/'), urlencode($token));
    }
}
