import {Expose, Type} from 'class-transformer';

export class Balance {
    @Expose()
    @Type(() => Date)
    public balanceAt: Date;

    @Expose()
    public balance: number;

    @Expose()
    public expenses: number;
}
