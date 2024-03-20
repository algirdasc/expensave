<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\User;
use App\Request\Auth\RegistrationRequest;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Security\Core\Exception\UnsupportedUserException;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\PasswordUpgraderInterface;

/**
 * @extends AbstractRepository<User>
 * @method User|null find($id, $lockMode = null, $lockVersion = null)
 * @method User|null findOneBy(array $criteria, array $orderBy = null)
 * @method User[]    findAll()
 * @method User[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class UserRepository extends AbstractRepository implements PasswordUpgraderInterface
{
    public function __construct(
        ManagerRegistry $registry,
        private readonly UserPasswordHasherInterface $passwordHasher
    ) {
        parent::__construct($registry, User::class);
    }

    public function create(RegistrationRequest $request, bool $flush = false): User
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

        $this->save($user, true);
    }
}
