import { Expose, Type } from 'class-transformer';
import { EntityInterface } from '../../interfaces/entity.interface';
import { Category } from './category';

export class CategoryRule implements EntityInterface {
    @Expose()
    public id: number;

    @Expose()
    @Type(() => Category)
    public category: Category;

    @Expose()
    public name: string;

    @Expose()
    public pattern: string;

    @Expose()
    public label?: string;
}
