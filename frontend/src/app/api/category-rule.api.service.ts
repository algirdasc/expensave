import { Injectable, Type } from '@angular/core';
import { EntityInterface } from '../interfaces/entity.interface';
import { AbstractEntityApiService } from './abstract-entity-api.service';
import { CategoryRule } from './objects/category-rule';

@Injectable()
export class CategoryRuleApiService extends AbstractEntityApiService<CategoryRule> {
    protected backend: string = '/category-rule';
    protected entity: Type<EntityInterface> = CategoryRule;
}
