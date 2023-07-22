<?php

declare(strict_types=1);

namespace App\Controller\Finance\Category;

use App\Controller\AbstractApiController;
use App\Response\EmptyResponse;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

#[Route('category/suggest', name: 'category_suggest_')]
class SuggestCategoryController extends AbstractApiController
{
    #[Route('rule_based', name: 'rule_based', methods: Request::METHOD_GET)]
    public function ruleBased(): JsonResponse
    {
        return $this->respond(new EmptyResponse());
    }
}