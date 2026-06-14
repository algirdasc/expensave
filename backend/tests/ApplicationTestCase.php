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

    protected static function getAssetFile(string $path): string
    {
        return __DIR__ . DIRECTORY_SEPARATOR . $path;
    }

    protected function getJsonResponse(AbstractBrowser $browser): array
    {
        return json_decode($browser->getResponse()->getContent(), true);
    }

    /**
     * @param list<array<string, mixed>> $items
     *
     * @return array<string|int, array<string, mixed>>
     */
    protected function indexBy(array $items, string $key): array
    {
        $indexed = [];

        foreach ($items as $item) {
            if (!array_key_exists($key, $item)) {
                throw new InvalidArgumentException(sprintf('Cannot index item without key "%s"', $key));
            }

            $indexed[$item[$key]] = $item;
        }

        return $indexed;
    }

    protected function getCalendarId(string $name): int
    {
        return $this->getEntityId($this->getCalendar($name));
    }

    protected function getCategoryId(string $name): int
    {
        return $this->getEntityId($this->getCategory($name));
    }

    protected function getExpenseId(string $label, ?string $calendarName = null): int
    {
        return $this->getEntityId($this->getExpense($label, $calendarName));
    }

    protected function getCalendar(string $name): Calendar
    {
        /** @var Calendar $calendar */
        $calendar = $this->getEntity(Calendar::class, ['name' => $name]);

        return $calendar;
    }

    protected function getCategory(string $name): Category
    {
        /** @var Category $category */
        $category = $this->getEntity(Category::class, ['name' => $name]);

        return $category;
    }

    protected function getExpense(string $label, ?string $calendarName = null): Expense
    {
        $criteria = ['label' => $label];

        if ($calendarName !== null) {
            $criteria['calendar'] = $this->getCalendar($calendarName);
        }

        /** @var Expense $expense */
        $expense = $this->getEntity(Expense::class, $criteria);

        return $expense;
    }

    private function getEntityId(Calendar|Category|Expense $entity): int
    {
        $id = $entity->getId();
        if (!is_int($id)) {
            throw new InvalidArgumentException(sprintf('Entity "%s" has no persisted integer ID', $entity::class));
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
