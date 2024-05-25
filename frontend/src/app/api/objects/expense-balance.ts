import { Expose, Type } from 'class-transformer';

export class ExpenseBalance {
    @Expose()
    @Type(() => Date)
    public balanceAt: Date;

    @Expose()
    public income: number;

    @Expose()
    public expense: number;

    @Expose()
    public change: number;

    @Expose()
    public balance: number;
}
