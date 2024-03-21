/* eslint-disable @typescript-eslint/no-explicit-any */
import {Injectable} from '@angular/core';
import {AbstractApiService} from './abstract.api.service';
import {Category} from './entities/category.entity';

@Injectable()
export class CategoryApiService extends AbstractApiService<Category> {
    protected backend: string = '/category';
    protected entity: any = Category;
}
