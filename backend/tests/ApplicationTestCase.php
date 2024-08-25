<?php

declare(strict_types=1);

namespace App\Tests;

use App\Entity\User;
use App\Repository\UserRepository;
use DAMA\DoctrineTestBundle\Doctrine\DBAL\StaticDriver;
use Doctrine\Bundle\FixturesBundle\Fixture;
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
use Symfony\Component\BrowserKit\AbstractBrowser;
use Symfony\Component\HttpFoundation\Response;

class ApplicationTestCase extends KernelTestCase
{
    use WebTestAssertionsTrait;

    public function setUp(): void
    {
        self::bootKernel();

        $this->resetAutoIncrement();
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

    protected function getAuthenticatedClient(?User $user = null): ?AbstractBrowser
    {
        if ($user === null) {
            $user = $this->getUser();
        }

        /** @var JWTTokenManagerInterface $jwtManager */
        $jwtManager = static::getContainer()->get(JWTTokenManagerInterface::class);
        $token = $jwtManager->create($user);

        /** @var AbstractBrowser $client */
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

    protected function getResponseJsonFile(string $path): string
    {
        return __DIR__ . DIRECTORY_SEPARATOR . $path;
    }

    protected function getJsonResponse(AbstractBrowser $browser): array
    {
        return json_decode($browser->getResponse()->getContent(), true);
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

    private function resetAutoIncrement(): void
    {
        $connection = $this->getContainer()->get('doctrine.dbal.default_connection');

        $results = $connection->executeQuery(
            'SELECT `table_name` FROM `information_schema`.`tables` WHERE `table_schema` = DATABASE() AND AUTO_INCREMENT > 1'
        )->fetchFirstColumn();

        foreach ($results as $result) {
            $connection->executeStatement("ALTER TABLE `$result` AUTO_INCREMENT = 1");
        }

        try {
            StaticDriver::commit();
        } catch (\Exception $e) {
            // There is a transaction only the first time
        }

        StaticDriver::beginTransaction();
    }
}