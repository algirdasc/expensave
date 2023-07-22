<?php

declare(strict_types=1);

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Annotation\Route;

#[Route('', name: 'default')]
class DefaultController extends AbstractController
{
    public function __invoke(): void
    {
        throw new NotFoundHttpException('This path does not exists');
    }
}
