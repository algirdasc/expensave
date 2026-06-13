/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { queryOptions } from '@tanstack/angular-query-experimental';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { CategoryApiService } from '../api/category.api.service';
import { Category } from '../api/objects/category';
import { QueryKeys } from './query-keys';

@Injectable({ providedIn: 'root' })
export class CategoryQueries {
    private categoryApiService = inject(CategoryApiService);

    public list() {
        return queryOptions({
            queryKey: QueryKeys.category.list,
            queryFn: (): Promise<Category[]> => lastValueFrom(this.categoryApiService.list()),
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
}
