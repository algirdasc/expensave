import { Expose, Type } from 'class-transformer';
import { Category } from './category';

export class CategoryBalance {
    @Expose()
    @Type(() => Category)
    public category: Category;

    @Expose()
    public income: number;

    @Expose()
    public expense: number;

    @Expose()
    public change: number;

    @Expose()
    public balance: number;
}
