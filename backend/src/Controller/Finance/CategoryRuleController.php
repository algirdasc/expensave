<?php

declare(strict_types=1);

namespace App\Controller\Finance;

use App\Controller\AbstractApiController;
use App\Entity\CategoryRule;
use App\Entity\User;
use App\Http\Request\Category\CreateCategoryRequest;
use App\Http\Request\Category\CreateCategoryRuleRequest;
use App\Http\Request\Category\UpdateCategoryRuleRequest;
use App\Http\Response\EmptyResponse;
use App\Repository\CategoryRuleRepository;
use App\Security\Voters\CategoryRuleVoter;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

#[Route('api/category-rule', name: 'category_rule_')]
class CategoryRuleController extends AbstractApiController
{
    public function __construct(
        private readonly CategoryRuleRepository $categoryRuleRepository
    ) {
    }

    #[Route('', name: 'index', methods: [Request::METHOD_GET])]
    public function index(#[CurrentUser] User $user): JsonResponse
    {
        return $this->respond($this->categoryRuleRepository->findAllUserRules($user));
    }

    #[Route('', name: 'create', methods: Request::METHOD_POST)]
    public function create(#[CurrentUser] User $user, CreateCategoryRuleRequest $request): JsonResponse
    {
        $categoryRule = (new CategoryRule())
            ->setCategory($request->getCategory())
            ->setName($request->getName())
            ->setPattern($request->getPattern())
            ->setLabel($request->getLabel())
            ->setOwner($user)
        ;

        $this->categoryRuleRepository->save($categoryRule);

        return $this->respond($categoryRule);
    }

    #[Route('/{categoryRule}', name: 'update', methods: Request::METHOD_PUT)]
    public function update(CategoryRule $categoryRule, UpdateCategoryRuleRequest $request): JsonResponse
    {
        $this->denyAccessUnlessGranted(CategoryRuleVoter::UPDATE, $categoryRule);

        $categoryRule
            ->setCategory($request->getCategory())
            ->setName($request->getName())
            ->setPattern($request->getPattern())
            ->setLabel($request->getLabel())
        ;

        $this->categoryRuleRepository->save($categoryRule);

        return $this->respond($categoryRule);
    }

    #[Route('/{categoryRule}', name: 'delete', methods: Request::METHOD_DELETE)]
    public function delete(CategoryRule $categoryRule): JsonResponse
    {
        $this->denyAccessUnlessGranted(CategoryRuleVoter::DELETE, $categoryRule);

        $this->categoryRuleRepository->remove($categoryRule);

        return $this->respond(new EmptyResponse());
    }
}