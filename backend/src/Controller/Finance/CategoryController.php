<?php

declare(strict_types=1);

namespace App\Controller\Finance;

use App\Controller\AbstractApiController;
use App\Entity\Category;
use App\Enum\CategoryType;
use App\Repository\CategoryRepository;
use App\Request\Category\CreateCategoryRequest;
use App\Request\Category\UpdateCategoryRequest;
use App\Response\EmptyResponse;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('api/category', name: 'category_')]
class CategoryController extends AbstractApiController
{
    public function __construct(
        private readonly CategoryRepository $categoryRepository,
    ) {
    }

    #[Route('', name: 'list', methods: Request::METHOD_GET)]
    public function list(Request $request): JsonResponse
    {
        $criteria = [];

        if ($request->query->get('userCategoriesOnly', '1')) {
            $criteria = ['type' => [
                CategoryType::USER,
                CategoryType::UNCATEGORIZED,
            ]];
        }

        return $this->respond($this->categoryRepository->findBy($criteria, ['name' => 'ASC']));
    }

    #[Route('/system', name: 'list_system', methods: Request::METHOD_GET)]
    public function system(): JsonResponse
    {
        return $this->respond($this->categoryRepository->getSystem());
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
            ->setType(CategoryType::USER)
        ;

        $this->categoryRepository->save($category);

        return $this->respond($category);
    }

    #[Route('/{category}', name: 'update', methods: Request::METHOD_PUT)]
    public function update(Category $category, UpdateCategoryRequest $request): JsonResponse
    {
        $category
            ->setName($request->getName())
            ->setColor($request->getColor())
        ;

        $this->categoryRepository->save($category);

        return $this->respond($category);
    }

    #[Route('/{category}', name: 'remove', methods: Request::METHOD_DELETE)]
    public function remove(Category $category): JsonResponse
    {
        if (!$category->isDefinedByUser()) {
            throw $this->createAccessDeniedException();
        }

        $this->categoryRepository->remove($category);

        return $this->respond(new EmptyResponse());
    }
}
