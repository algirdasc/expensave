import {Expose, Type} from 'class-transformer';
import {BalanceMeta} from '../objects/balance-meta';
import {CategoryBalance} from '../objects/category-balance';

export class CategoryExpenseReportResponse {
    @Expose()
    @Type(() => CategoryBalance)
    public categoryBalances: CategoryBalance[];

    @Expose()
    @Type(() => BalanceMeta)
    public meta: BalanceMeta;
}
