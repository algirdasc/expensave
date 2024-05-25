import { Injectable, Type } from '@angular/core';
import { EntityInterface } from '../interfaces/entity.interface';
import { AbstractApiService } from './abstract.api.service';
import { Category } from './objects/category';

@Injectable()
export class CategoryApiService extends AbstractApiService<Category> {
    protected backend: string = '/category';
    protected entity: Type<EntityInterface> = Category;
}
