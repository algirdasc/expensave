<?php

declare(strict_types=1);

namespace App\Controller\Auth;

use App\Controller\AbstractApiController;
use App\Enum\Error;
use LogicException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('api/auth/login', name: 'login_')]
class LoginController extends AbstractApiController
{
    #[Route('', name: 'index', methods: Request::METHOD_POST)]
    public function index(): JsonResponse
    {
        // JWT will take care of everything, so this error should not happen
        throw new LogicException(Error::AUTH_HANDLE_ERROR->message());
    }
}
