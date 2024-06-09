import { Injectable, Type } from '@angular/core';
import { Observable } from 'rxjs';
import { EntityInterface } from '../interfaces/entity.interface';
import { AbstractApiService } from './abstract.api.service';
import { Category } from './objects/category';

@Injectable()
export class CategoryApiService extends AbstractApiService<Category> {
    protected backend: string = '/category';
    protected entity: Type<EntityInterface> = Category;

    public system(): Observable<Category[]> {
        return super.request<Category[]>('get', Category, `${this.backend}/system`);
    }
}
