<?php

declare(strict_types=1);

namespace App\Tests;

use App\Entity\Calendar;
use App\Entity\Category;
use App\Entity\Expense;
use App\Entity\User;
use App\Repository\UserRepository;
use DAMA\DoctrineTestBundle\Doctrine\DBAL\StaticDriver;
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

        /** @var KernelBrowser $browser */
        $browser = self::getClient($client);

        return $browser;
    }

    protected function assertResponseEqualToJson(Response $response, string $jsonFile): void
    {
        $expected = json_decode((string) file_get_contents(self::getAssetFile($jsonFile)), true);
        $actual = json_decode((string) $response->getContent(), true);

        $this->assertSame(
            $this->normalizeGeneratedIdentifiers($expected),
            $this->normalizeGeneratedIdentifiers($actual)
        );
    }

    protected static function getAssetFile(string $path): string
    {
        return __DIR__ . DIRECTORY_SEPARATOR . $path;
    }

    protected function getJsonResponse(AbstractBrowser $browser): array
    {
        return json_decode($browser->getResponse()->getContent(), true);
    }

    protected function getCalendarId(string $name): int
    {
        return $this->getEntityId(Calendar::class, ['name' => $name]);
    }

    protected function getCategoryId(string $name): int
    {
        return $this->getEntityId(Category::class, ['name' => $name]);
    }

    protected function getExpenseId(string $label, ?string $calendarName = null): int
    {
        $criteria = ['label' => $label];

        if ($calendarName !== null) {
            $criteria['calendar'] = $this->getEntity(Calendar::class, ['name' => $calendarName]);
        }

        return $this->getEntityId(Expense::class, $criteria);
    }

    /**
     * @param class-string $entityClass
     * @param array<string, mixed> $criteria
     */
    private function getEntityId(string $entityClass, array $criteria): int
    {
        $entity = $this->getEntity($entityClass, $criteria);

        if (!method_exists($entity, 'getId')) {
            throw new InvalidArgumentException(sprintf('Entity "%s" does not expose getId()', $entityClass));
        }

        $id = $entity->getId();
        if (!is_int($id)) {
            throw new InvalidArgumentException(sprintf('Entity "%s" has no persisted integer ID', $entityClass));
        }

        return $id;
    }

    /**
     * @param class-string $entityClass
     * @param array<string, mixed> $criteria
     */
    private function getEntity(string $entityClass, array $criteria): object
    {
        /** @var EntityManagerInterface $manager */
        $manager = self::getContainer()->get('doctrine')->getManager();
        $entity = $manager->getRepository($entityClass)->findOneBy($criteria);

        if ($entity === null) {
            throw new InvalidArgumentException(sprintf('Entity "%s" by criteria "%s" is not found', $entityClass, json_encode($criteria)));
        }

        return $entity;
    }

    private function normalizeGeneratedIdentifiers(mixed $value): mixed
    {
        if (!is_array($value)) {
            return $value;
        }

        $normalized = [];
        foreach ($value as $key => $nestedValue) {
            $normalized[$key] = $nestedValue !== null && in_array($key, ['id', 'defaultCalendarId'], true)
                ? '__generated_id__'
                : $this->normalizeGeneratedIdentifiers($nestedValue);
        }

        if (!array_is_list($normalized)) {
            ksort($normalized);
        }

        return $normalized;
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
