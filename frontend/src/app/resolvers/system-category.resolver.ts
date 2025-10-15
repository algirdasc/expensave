import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CategoryApiService } from '../api/category.api.service';
import { Category } from '../api/objects/category';

@Injectable()
export class SystemCategoryResolver {
    private readonly categoryApiService = inject(CategoryApiService);


    public resolve(): Observable<Category[]> {
        return this.categoryApiService.system();
    }
}
