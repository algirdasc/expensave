import { Routes } from '@angular/router';
import { canActivateAuthenticated } from './modules/auth/auth.functions';
import { Error404Component } from './modules/error-404.component';
import { inject } from '@angular/core';
import { CategoryQueries } from './queries/category.queries';
import { QueryClient } from '@tanstack/angular-query-experimental';
import { CalendarQueries } from './queries/calendar.queries';
import { UserQueries } from './queries/user.queries';
import { Category } from './api/objects/category';
import { Calendar } from './api/objects/calendar';
import { User } from './api/objects/user';

const systemCategoriesResolver = (): Promise<Category[]> => {
    const categoriesQuery = inject(CategoryQueries);
    const queryClient = inject(QueryClient);

    return queryClient.ensureQueryData(categoriesQuery.system());
};

const calendarResolver = (): Promise<Calendar[]> => {
    const calendarQuery = inject(CalendarQueries);
    const queryClient = inject(QueryClient);

    return queryClient.ensureQueryData(calendarQuery.list());
};

const userResolver = (): Promise<User> => {
    const userQuery = inject(UserQueries);
    const queryClient = inject(QueryClient);

    return queryClient.ensureQueryData(userQuery.profile());
};

export const appRoutes: Routes = [
    {
        path: '',
        redirectTo: '/calendar',
        pathMatch: 'full',
    },
    {
        path: 'calendar',
        canActivate: [canActivateAuthenticated],
        resolve: {
            user: userResolver,
            calendars: calendarResolver,
            systemCategories: systemCategoriesResolver,
        },
        loadChildren: () => import('./modules/main/main.module').then(m => m.MainModule),
    },
    {
        path: 'reports',
        canActivate: [canActivateAuthenticated],
        resolve: {
            user: userResolver,
            calendars: calendarResolver,
        },
        loadChildren: () => import('./modules/reports/reports.module').then(m => m.ReportsModule),
    },
    {
        path: 'auth',
        loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule),
    },
    {
        path: '**',
        component: Error404Component,
    },
];
