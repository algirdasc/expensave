<?php

declare(strict_types=1);

namespace App\Serializer;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Serializer\Normalizer\DenormalizerInterface;

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

    /**
     * @phpstan-param class-string $format
     */
    public function denormalize(mixed $data, string $type, string $format = null, array $context = []): ?Collection
    {
        if (null === $data || null === $format) {
            return null;
        }

        $data = array_filter($data, function ($item) {
            return is_int($item);
        });

        $repository = $this->entityManager->getRepository($format);
        $data = $repository->findBy(['id' => $data]);

        return new ArrayCollection($data);
    }
}
