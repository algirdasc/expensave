<?php

declare(strict_types=1);

namespace App\Controller\Auth;

use App\Controller\AbstractApiController;
use App\Request\Auth\PasswordForgotRequest;
use App\Request\Auth\PasswordResetRequest;
use App\Response\EmptyResponse;
use App\Service\PasswordResetService;
use Nelmio\ApiDocBundle\Annotation\Security;
use OpenApi\Attributes as OA;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

#[Route('auth/password', name: 'password_')]
#[OA\Tag(name: 'Authentication')]
#[Security(name: '')]
class PasswordController extends AbstractApiController
{
    #[Route('/forgot', name: 'forgot', methods: Request::METHOD_POST)]
    public function forgotPassword(PasswordForgotRequest $request, PasswordResetService $passwordResetService): JsonResponse
    {
        $passwordResetService->forgotPassword($request->getEmail());

        return $this->respond(new EmptyResponse());
    }

    #[Route('/reset', name: 'reset', methods: Request::METHOD_PUT)]
    public function resetPassword(PasswordResetRequest $request, PasswordResetService $passwordResetService): JsonResponse
    {
        $passwordResetService->resetPassword($request->getHash(), $request->getPassword());

        return $this->respond(new EmptyResponse());
    }
}
