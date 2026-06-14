/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { mutationOptions, QueryClient, queryOptions } from '@tanstack/angular-query-experimental';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { CategoryApiService } from '../api/category.api.service';
import { Category } from '../api/objects/category';
import { QueryKeys } from './query-keys';
import { HttpParams } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class CategoryQueries {
    private categoryApiService = inject(CategoryApiService);
    private queryClient = inject(QueryClient);

    public list(params?: HttpParams) {
        return queryOptions({
            queryKey: QueryKeys.category.list(params),
            queryFn: (): Promise<Category[]> => lastValueFrom(this.categoryApiService.list(params)),
        });
    }

    public get(categoryId: number) {
        return queryOptions({
            queryKey: QueryKeys.category.detail(categoryId),
            queryFn: (): Promise<Category> => lastValueFrom(this.categoryApiService.get(categoryId)),
        });
    }

    public system() {
        return queryOptions({
            queryKey: QueryKeys.category.system,
            queryFn: (): Promise<Category[]> => lastValueFrom(this.categoryApiService.system()),
        });
    }

    public save() {
        return mutationOptions({
            mutationKey: ['category', 'save'],
            mutationFn: (category: Category): Promise<Category> =>
                lastValueFrom(this.categoryApiService.save(category)),
            onSuccess: (category: Category): Promise<void[]> =>
                Promise.all([
                    this.queryClient.invalidateQueries({ queryKey: QueryKeys.category.lists }),
                    this.queryClient.invalidateQueries({ queryKey: QueryKeys.category.detail(category.id) }),
                    this.queryClient.invalidateQueries({ queryKey: QueryKeys.calendar.expenses }),
                    this.queryClient.invalidateQueries({ queryKey: QueryKeys.report.all }),
                    this.queryClient.invalidateQueries({ queryKey: QueryKeys.expense.all }),
                ]),
        });
    }

    public delete() {
        return mutationOptions({
            mutationKey: ['category', 'delete'],
            mutationFn: (category: Category): Promise<Category[]> =>
                lastValueFrom(this.categoryApiService.delete(category.id)),
            onSuccess: (_response: Category[], category: Category): Promise<void[]> =>
                Promise.all([
                    this.queryClient.invalidateQueries({ queryKey: QueryKeys.category.lists }),
                    this.queryClient.invalidateQueries({ queryKey: QueryKeys.category.detail(category.id) }),
                    this.queryClient.invalidateQueries({ queryKey: QueryKeys.calendar.expenses }),
                    this.queryClient.invalidateQueries({ queryKey: QueryKeys.report.all }),
                    this.queryClient.invalidateQueries({ queryKey: QueryKeys.expense.all }),
                ]),
        });
    }
}
