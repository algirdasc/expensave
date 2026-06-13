import { HttpParams } from '@angular/common/http';

const paramsKey = (params?: HttpParams): string => params?.toString() ?? '';

export const QueryKeys = {
    calendar: {
        all: ['calendar'] as const,
        lists: ['calendar', 'list'] as const,
        list: (params?: HttpParams) => ['calendar', 'list', paramsKey(params)] as const,
        details: ['calendar', 'detail'] as const,
        detail: (calendarId: number) => ['calendar', 'detail', calendarId] as const,
        expenses: ['calendar', 'expenses'] as const,
        expenseList: (calendarId: number, dateFrom: Date, dateTo: Date) =>
            ['calendar', 'expenses', calendarId, dateFrom.getTime(), dateTo.getTime()] as const,
    },
    category: {
        all: ['category'] as const,
        lists: ['category', 'list'] as const,
        list: (params?: HttpParams) => ['category', 'list', paramsKey(params)] as const,
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
        dailyExpenses: (calendarIds: number[], dateFrom: Date, dateTo: Date) =>
            ['report', 'daily-expenses', calendarIds, dateFrom.getTime(), dateTo.getTime()] as const,
        monthlyExpenses: (calendarIds: number[], dateFrom: Date, dateTo: Date) =>
            ['report', 'monthly-expenses', calendarIds, dateFrom.getTime(), dateTo.getTime()] as const,
        categoryExpenses: (calendarIds: number[], dateFrom: Date, dateTo: Date) =>
            ['report', 'category-expenses', calendarIds, dateFrom.getTime(), dateTo.getTime()] as const,
    },
    expense: {
        all: ['expense'] as const,
        detail: (expenseId: number) => ['expense', 'detail', expenseId] as const,
        suggestion: (label: string) => ['expense', 'suggestion', label] as const,
    },
};
