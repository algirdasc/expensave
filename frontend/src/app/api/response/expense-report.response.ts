import { Expose, Type } from 'class-transformer';
import { BalanceMeta } from '../objects/balance-meta';
import { ExpenseBalance } from '../objects/expense-balance';

export class ExpenseReportResponse {
    @Expose()
    @Type(() => ExpenseBalance)
    public expenseBalances: ExpenseBalance[];

    @Expose()
    @Type(() => BalanceMeta)
    public meta: BalanceMeta;
}
