import {Expose, Type} from 'class-transformer';
import {Expense} from '../objects/expense';

export class ExpenseSuggestResponse {
    @Expose()
    @Type(() => Expense)
    public expense?: Expense;
}
