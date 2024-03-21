import {Injectable, Type} from '@angular/core';
import {AbstractApiService} from './abstract.api.service';
import {Category} from './entities/category.entity';
import {EntityInterface} from './entities/entity.interface';

@Injectable()
export class CategoryApiService extends AbstractApiService<Category> {
    protected backend: string = '/category';
    protected entity: Type<EntityInterface> = Category;
}
