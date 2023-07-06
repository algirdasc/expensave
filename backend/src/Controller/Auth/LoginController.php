<?php

declare(strict_types=1);

namespace App\Controller\Auth;

use App\Entity\User;
use App\Enum\ErrorEnum;
use App\Request\Auth\LoginRequest;
use LogicException;
use Nelmio\ApiDocBundle\Annotation\Model;
use Nelmio\ApiDocBundle\Annotation\Security;
use OpenApi\Attributes as OA;
use App\Controller\AbstractApiController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('auth/login', name: 'login_')]
#[OA\Tag(name: 'Authentication')]
#[Security(name: '')]
class LoginController extends AbstractApiController
{
    #[Route('', name: 'index', methods: Request::METHOD_POST)]
    #[OA\RequestBody(
        content: new OA\JsonContent(
            ref: new Model(type: LoginRequest::class)
        )
    )]
    #[OA\Response(
        response: Response::HTTP_OK,
        description: 'Successful response',
        content: new Model(type: User::class)
    )]
    public function index(): JsonResponse
    {
        // JWT will take care of everything, so this error should not happen
        throw new LogicException(ErrorEnum::AUTH_HANDLE_ERROR->message());
    }
}
