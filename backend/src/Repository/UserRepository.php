<?php

namespace App\Repository;

use App\Entity\User;
use App\Request\Auth\RegistrationRequest;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Security\Core\Exception\UnsupportedUserException;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\PasswordUpgraderInterface;
use function get_class;

/**
 * @extends ServiceEntityRepository<User>
 *
 * @method User|null find($id, $lockMode = null, $lockVersion = null)
 * @method User|null findOneBy(array $criteria, array $orderBy = null)
 * @method User[]    findAll()
 * @method User[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class UserRepository extends ServiceEntityRepository implements PasswordUpgraderInterface
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
            ->setName($request->getName())
            ->setActive(true)
            ->setPlainPassword($request->getPassword())
        ;

        $this->save($user, $flush);

        return $user;
    }

    public function save(User $user, bool $flush = false): void
    {
        if ($user->getPlainPassword() !== null) {
            $user
                ->setPassword($this->passwordHasher->hashPassword($user, $user->getPlainPassword()))
                ->setPlainPassword(null)
            ;
        }

        $this->getEntityManager()->persist($user);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(User $user, bool $flush = false): void
    {
        $this->getEntityManager()->remove($user);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
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
