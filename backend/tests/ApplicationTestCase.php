<?php

declare(strict_types=1);

namespace App\Tests;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\Bundle\FixturesBundle\Loader\SymfonyFixturesLoader;
use Doctrine\Common\DataFixtures\Executor\ORMExecutor;
use Doctrine\Common\DataFixtures\Loader;
use Doctrine\Common\DataFixtures\Purger\ORMPurger;
use Doctrine\ORM\EntityManagerInterface;
use InvalidArgumentException;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Symfony\Bundle\FrameworkBundle\Test\WebTestAssertionsTrait;
use Symfony\Component\HttpFoundation\Response;

class ApplicationTestCase extends KernelTestCase
{
    use WebTestAssertionsTrait;

    public function setUp(): void
    {
        self::bootKernel();

        $this->loadFixtures();
    }

    public function tearDown(): void
    {
        parent::tearDown();
        self::getClient(null);
    }

    protected function getUser(string $name = 'User 1'): User
    {
        /** @var UserRepository $userRepository */
        $userRepository = static::getContainer()->get(UserRepository::class);
        $user = $userRepository->findOneBy(['name' => $name]);
        if ($user === null) {
            throw new InvalidArgumentException(sprintf('User by name "%s" is not found', $name));
        }

        return $user;
    }

    protected function getAuthenticatedClient(?User $user = null): KernelBrowser
    {
        if ($user === null) {
            $user = $this->getUser();
        }

        /** @var JWTTokenManagerInterface $jwtManager */
        $jwtManager = static::getContainer()->get(JWTTokenManagerInterface::class);
        $token = $jwtManager->create($user);

        $client = self::getContainer()->get('test.client');

        $client->setServerParameters([
            'CONTENT_TYPE' => 'application/json',
            'HTTP_AUTHORIZATION' => "Bearer $token"
        ]);

        return self::getClient($client);
    }

    protected function assertResponseEqualToJson(Response $response, string $jsonFile): void
    {
        $this->assertJsonStringEqualsJsonFile(
            $this->getResponseJsonFile($jsonFile),
            (string) $response->getContent()
        );
    }

    private function loadFixtures(): void
    {
        $loader = new Loader();
        $loader->loadFromDirectory(__DIR__ . '/../src/DataFixtures');

        /** @var EntityManagerInterface $manager */
        $manager = self::getContainer()->get('doctrine')->getManager();
        $executor = new ORMExecutor($manager, new ORMPurger($manager));

        $executor->execute($loader->getFixtures());
    }

    protected function getResponseJsonFile(string $path): string
    {
        return __DIR__ . DIRECTORY_SEPARATOR . $path;
    }

    protected function getJsonResponse(KernelBrowser $browser): array
    {
        return json_decode($browser->getResponse()->getContent(), true);
    }
}