<?php

declare(strict_types=1);

namespace App\Controller\Auth;

use App\Controller\AbstractApiController;
use App\Request\Auth\PasswordForgotRequest;
use App\Request\Auth\PasswordResetRequest;
use App\Response\EmptyResponse;
use App\Service\PasswordResetService;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('api/auth/password', name: 'password_')]
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
