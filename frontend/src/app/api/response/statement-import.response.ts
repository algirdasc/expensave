import { Expose, Type } from 'class-transformer';
import { Expense } from '../objects/expense';

export class StatementImportResponse {
    @Expose()
    @Type(() => Expense)
    public expenses: Expense[];
}
