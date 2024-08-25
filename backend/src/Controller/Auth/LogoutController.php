<?php

declare(strict_types=1);

namespace App\Controller\Auth;

use App\Controller\AbstractApiController;
use App\Http\Response\EmptyResponse;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('api/auth/logout', name: 'logout_')]
class LogoutController extends AbstractApiController
{
    #[Route('', name: 'index', methods: Request::METHOD_DELETE)]
    public function index(): JsonResponse
    {
        return $this->respond(new EmptyResponse());
    }
}
