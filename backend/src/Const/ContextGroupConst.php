<?php

declare(strict_types=1);

namespace App\Const;

use Symfony\Component\HttpFoundation\Request;

/*
 * While enums cannot be used in attributes using constants instead
 */
class ContextGroupConst
{
    public const BASIC = 'basic';

    public const API_CREATE = 'api_create';
    public const API_READ = 'api_read';
    public const API_UPDATE = 'api_update';
    public const API_DELETE = 'api_delete';

    public const API_ALL = [
        self::API_CREATE,
        self::API_READ,
        self::API_UPDATE,
        self::API_DELETE,
    ];

    public const API_ERROR = 'api_error';

    /**
     * @return string|array<string>
     */
    public static function fromRequest(Request $request): string|array
    {
        return match ($request->getMethod())
        {
            Request::METHOD_POST => self::API_CREATE,
            Request::METHOD_GET => self::API_READ,
            Request::METHOD_PUT => self::API_UPDATE,
            Request::METHOD_DELETE => self::API_DELETE,
            default => self::API_ALL,
        };
    }
}
