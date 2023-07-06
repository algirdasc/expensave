<?php

declare(strict_types=1);

namespace App\Controller;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/', name: 'index_')]
class DefaultController
{
    #[Route('', name: 'index')]
    public function index(): JsonResponse
    {
        return new JsonResponse(['Hello' => 'World']);
    }
}