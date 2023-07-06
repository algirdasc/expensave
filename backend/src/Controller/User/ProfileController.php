<?php

declare(strict_types=1);

namespace App\Controller\User;

use App\Const\ContextGroup\UserContextGroupConst;
use App\Controller\AbstractApiController;
use App\Repository\UserRepository;
use App\Response\EntityResponse;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Validator\Constraints\Json;

#[Route('user', name: 'user_')]
class ProfileController extends AbstractApiController
{
    public function __construct(
        private readonly UserRepository $userRepository
    ) {
    }

    #[Route('', methods: Request::METHOD_GET)]
    public function list(): JsonResponse
    {
        return $this->respond(
            new EntityResponse($this->userRepository->findAll())
        );
    }

    #[Route('/profile', methods: Request::METHOD_GET)]
    public function profile(): JsonResponse
    {
        return $this->respond(
            new EntityResponse($this->getUser()),
            [UserContextGroupConst::DETAILS]
        );
    }

    #[Route('/profile', methods: Request::METHOD_PUT)]
    public function update(): JsonResponse
    {
        sleep(2);
        // TODO: save

        return $this->respond(
            new EntityResponse($this->getUser()),
            [UserContextGroupConst::DETAILS]
        );
    }
}
