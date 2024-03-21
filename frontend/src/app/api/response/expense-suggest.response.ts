import {Expose, Type} from 'class-transformer';
import {Category} from '../entities/category.entity';

export class ExpenseSuggestResponse {
    @Expose()
    public label: string;

    @Expose()
    @Type(() => Category)
    public category: Category;
}
