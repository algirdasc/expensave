import { queryOptions } from '@tanstack/angular-query-experimental';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { CategoryApiService } from '../api/category.api.service';

@Injectable()
export class CategoryQueries {
    categoryApiService = inject(CategoryApiService);

    list() {
        return queryOptions({
            queryKey: ['category'],
            queryFn: () => lastValueFrom(this.categoryApiService.list()),
        });
    }

    get(categoryId: number) {
        return queryOptions({
            queryKey: ['category', categoryId],
            queryFn: () => lastValueFrom(this.categoryApiService.get(categoryId)),
        });
    }

    system() {
        return queryOptions({
            queryKey: ['category', 'system'],
            queryFn: () => lastValueFrom(this.categoryApiService.system()),
        });
    }
}
