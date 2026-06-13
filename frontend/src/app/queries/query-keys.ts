import { HttpParams } from '@angular/common/http';

const paramsKey = (params?: HttpParams): string => params?.toString() ?? '';

export const QueryKeys = {
    calendar: {
        all: ['calendar'] as const,
        lists: ['calendar', 'list'] as const,
        list: (params?: HttpParams) => ['calendar', 'list', paramsKey(params)] as const,
        details: ['calendar', 'detail'] as const,
        detail: (calendarId: number) => ['calendar', 'detail', calendarId] as const,
    },
    category: {
        all: ['category'] as const,
        list: ['category', 'list'] as const,
        detail: (categoryId: number) => ['category', 'detail', categoryId] as const,
        system: ['category', 'system'] as const,
    },
    user: {
        all: ['user'] as const,
        profile: ['user', 'profile'] as const,
        list: ['user', 'list'] as const,
    },
    report: {
        all: ['report'] as const,
    },
};
