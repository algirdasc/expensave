<?php

declare(strict_types=1);

namespace App\Controller\Auth;

use App\Controller\AbstractApiController;
use App\Response\EmptyResponse;
use OpenApi\Attributes as OA;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

#[Route('auth/logout', name: 'logout_')]
#[OA\Tag(name: 'Authentication')]
class LogoutController extends AbstractApiController
{
    #[Route('', name: 'index', methods: Request::METHOD_DELETE)]
    public function index(): JsonResponse
    {
        return $this->respond(new EmptyResponse());
    }
}
