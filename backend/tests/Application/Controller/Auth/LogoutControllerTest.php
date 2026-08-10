<?php

declare(strict_types=1);

namespace App\Tests\Application\Controller\Auth;

use App\Controller\Auth\LogoutController;
use App\Entity\RefreshToken;
use App\Repository\RefreshTokenRepository;
use App\Tests\ApplicationTestCase;
use DateTime;
use PHPUnit\Framework\Attributes\CoversClass;
use Symfony\Component\HttpFoundation\Response;

#[CoversClass(LogoutController::class)]
class LogoutControllerTest extends ApplicationTestCase
{
    public function testLogoutRevokesRefreshTokens(): void
    {
        $client = $this->getAuthenticatedClient();
        $user = $this->getUser();

        /** @var RefreshTokenRepository $refreshTokenRepository */
        $refreshTokenRepository = self::getContainer()->get(RefreshTokenRepository::class);

        $refreshTokenRepository->save($this->createRefreshToken('user1-refresh-token', $user->getEmail()));
        $refreshTokenRepository->save($this->createRefreshToken('user2-refresh-token', 'user2@email.com'));

        $client->jsonRequest('POST', '/api/auth/refresh-token', ['refreshToken' => 'user1-refresh-token']);
        $this->assertResponseIsSuccessful();
        $rotatedToken = $this->getJsonResponse($client)['refreshToken'];

        $client->jsonRequest('DELETE', '/api/auth/logout');
        $this->assertResponseIsSuccessful();

        $client->jsonRequest('POST', '/api/auth/refresh-token', ['refreshToken' => $rotatedToken]);
        $this->assertResponseStatusCodeSame(Response::HTTP_UNAUTHORIZED);

        $this->assertNull($refreshTokenRepository->findOneBy(['username' => $user->getEmail()]));
        $this->assertNotNull($refreshTokenRepository->findOneBy(['refreshToken' => 'user2-refresh-token']));
    }

    private function createRefreshToken(string $token, string $username): RefreshToken
    {
        return (new RefreshToken())
            ->setRefreshToken($token)
            ->setUsername($username)
            ->setValid(new DateTime('+1 month'))
        ;
    }
}
