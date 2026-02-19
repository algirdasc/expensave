/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { queryOptions } from '@tanstack/angular-query-experimental';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { CategoryApiService } from '../api/category.api.service';
import { Category } from '../api/objects/category';

@Injectable()
export class CategoryQueries {
    private categoryApiService = inject(CategoryApiService);

    public list() {
        return queryOptions({
            queryKey: ['category'],
            queryFn: (): Promise<Category[]> => lastValueFrom(this.categoryApiService.list()),
        });
    }

    public get(categoryId: number) {
        return queryOptions({
            queryKey: ['category', { id: categoryId }],
            queryFn: (): Promise<Category> => lastValueFrom(this.categoryApiService.get(categoryId)),
        });
    }

    public system() {
        return queryOptions({
            queryKey: ['category', 'system'],
            queryFn: (): Promise<Category[]> => lastValueFrom(this.categoryApiService.system()),
        });
    }
}
