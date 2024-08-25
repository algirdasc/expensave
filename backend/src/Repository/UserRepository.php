<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\User;
use App\Http\Request\Auth\RegistrationRequest;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Bridge\Doctrine\Security\User\UserLoaderInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Security\Core\Exception\UnsupportedUserException;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\PasswordUpgraderInterface;
use Symfony\Component\Security\Core\User\UserInterface;

/**
 * @extends AbstractRepository<User>
 * @method User|null find($id, $lockMode = null, $lockVersion = null)
 * @method User|null findOneBy(array $criteria, array $orderBy = null)
 * @method array<User> findAll()
 * @method array<User> findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class UserRepository extends AbstractRepository implements PasswordUpgraderInterface, UserLoaderInterface
{
    public function __construct(
        ManagerRegistry $registry,
        private readonly UserPasswordHasherInterface $passwordHasher
    ) {
        parent::__construct($registry, User::class);
    }

    public function create(RegistrationRequest $request): User
    {
        $user = (new User())
            ->setEmail($request->getEmail())
            ->setActive(true)
            ->setPlainPassword($request->getPassword())
        ;

        $this->save($user);

        return $user;
    }

    public function save($entity): void
    {
        if ($entity->getPlainPassword() !== null) {
            $entity
                ->setPassword($this->passwordHasher->hashPassword($entity, $entity->getPlainPassword()))
                ->setPlainPassword(null)
            ;
        }

        parent::save($entity);
    }

    public function upgradePassword(PasswordAuthenticatedUserInterface $user, string $newHashedPassword): void
    {
        if (!$user instanceof User) {
            throw new UnsupportedUserException(sprintf('Instances of "%s" are not supported.', get_class($user)));
        }

        $user->setPassword($newHashedPassword);

        $this->save($user);
    }

    public function loadUserByIdentifier(string $identifier): ?UserInterface
    {
        return $this->findOneBy(['email' => $identifier, 'active' => true]);
    }
}
