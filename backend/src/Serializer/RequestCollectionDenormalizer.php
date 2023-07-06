<?php

declare(strict_types=1);

namespace App\Serializer;

use _PHPStan_4dd92cd93\Symfony\Contracts\Service\Attribute\Required;
use CodeIgniter\Entity;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Serializer\Normalizer\DenormalizerInterface;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;

class RequestCollectionDenormalizer implements DenormalizerInterface
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager
    ) {
    }

    public function supportsDenormalization(mixed $data, string $type, string $format = null): bool
    {
        return $type === Collection::class;
    }

    public function denormalize(mixed $data, string $type, string $format = null, array $context = []): ?Collection
    {
        if ($data === null) {
            return null;
        }

        $data = array_filter($data, function ($item) {
            return is_int($item);
        });

        return new ArrayCollection($this->entityManager->getRepository($format)->findBy(['id' => $data]));
    }
}
