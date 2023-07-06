<?php

declare(strict_types=1);

namespace App\Controller\Finance;

use App\Controller\AbstractApiController;
use App\Entity\Calendar;
use App\Entity\Category;
use App\Repository\CategoryRepository;
use App\Request\Category\CreateCategoryRequest;
use App\Request\Category\UpdateCategoryRequest;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Validator\Constraints\Json;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('category', name: 'category_')]
class CategoryController extends AbstractApiController
{
    public function __construct(
        private readonly CategoryRepository $categoryRepository,
    ) {
    }

    #[Route('', name: 'list', methods: Request::METHOD_GET)]
    public function list(): JsonResponse
    {
        $categories = $this->categoryRepository->findAll();

        return $this->respond($categories);
    }

    #[Route('/{category}', name: 'get', methods: Request::METHOD_GET)]
    public function get(Category $category): JsonResponse
    {
        return $this->respond($category);
    }

    #[Route('', name: 'create', methods: Request::METHOD_POST)]
    public function create(CreateCategoryRequest $request): JsonResponse
    {
        $category = (new Category())
            ->setName($request->getName())
            ->setColor($request->getColor())
        ;

        $this->categoryRepository->save($category, true);

        return $this->respond($category);
    }

    #[Route('/{category}', name: 'update', methods: Request::METHOD_PUT)]
    public function update(Category $category, UpdateCategoryRequest $request): JsonResponse
    {
        $category
            ->setName($request->getName())
            ->setColor($request->getColor())
        ;

        $this->categoryRepository->save($category, true);

        return $this->respond($category);
    }

    #[Route('/{category}', name: 'remove', methods: Request::METHOD_DELETE)]
    public function remove(Category $category): JsonResponse
    {
        $this->categoryRepository->remove($category, true);

        return $this->respond($this->categoryRepository->findAll());
    }
}
