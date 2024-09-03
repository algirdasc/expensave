<?php

declare(strict_types=1);

namespace App\Const;

use Symfony\Component\HttpFoundation\Request;

/*
 * While enums cannot be used in attributes using constants instead
 */
/**
 * @codeCoverageIgnore
 */
class ContextGroupConst
{
    public const API_ALWAYS = 'always';
    public const API_CREATE = 'api_create';
    public const API_READ = 'api_read';
    public const API_UPDATE = 'api_update';
    public const API_DELETE = 'api_delete';

    public const API_ALL = [
        self::API_ALWAYS,
        self::API_CREATE,
        self::API_READ,
        self::API_UPDATE,
        self::API_DELETE,
    ];

    public const API_ERROR = 'api_error';

    /**
     * @param array<string> $additionalGroups
     *
     * @return array<string>
     */
    public static function fromRequest(array $additionalGroups = []): array
    {
        $request = Request::createFromGlobals();

        return match ($request->getMethod())
        {
            Request::METHOD_POST => [
                self::API_ALWAYS,
                self::API_CREATE,
                ...$additionalGroups
            ],
            Request::METHOD_GET => [
                self::API_ALWAYS,
                self::API_READ,
                ...$additionalGroups
            ],
            Request::METHOD_PUT => [
                self::API_ALWAYS,
                self::API_UPDATE,
                ...$additionalGroups
            ],
            Request::METHOD_DELETE => [
                self::API_ALWAYS,
                self::API_DELETE,
                ...$additionalGroups
            ],
            default => self::API_ALL,
        };
    }
}
