<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Gesdinet\JWTRefreshTokenBundle\Entity\RefreshToken as BaseRefreshToken;

/**
 * @codeCoverageIgnore
 */
#[ORM\Entity]
class RefreshToken extends BaseRefreshToken
{
}
