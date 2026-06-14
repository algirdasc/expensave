import { Expose, Type } from 'class-transformer';
import { EntityInterface } from '../../interfaces/entity.interface';
import { Calendar } from './calendar';
import { Category } from './category';
import { User } from './user';

export type RecurringExpenseFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly';
export type RecurringExpenseUpdateScope = 'this' | 'future' | 'past' | 'all';

export class Expense implements EntityInterface {
    @Expose()
    public id: number;

    @Expose()
    public label: string;

    @Expose()
    public amount: number;

    @Expose()
    @Type(() => Date)
    public createdAt: Date;

    @Expose()
    @Type(() => Calendar)
    public calendar: Calendar;

    @Expose()
    @Type(() => User)
    public user: User;

    @Expose()
    @Type(() => Category)
    public category: Category;

    @Expose()
    public confirmed: boolean;

    @Expose()
    public description?: string;

    @Expose()
    public recurring: boolean = false;

    @Expose()
    public recurringFrequency: RecurringExpenseFrequency | null = 'monthly';

    @Expose()
    public recurringOccurrences: number | null = 12;

    public recurringUpdateScope: RecurringExpenseUpdateScope = 'this';

    private _isExpense: boolean;

    public get absoluteAmount(): number {
        return this.amount ? Math.abs(this.amount) : undefined;
    }

    public get isExpense(): boolean {
        if (this._isExpense === undefined) {
            this._isExpense = !(this.amount > 0);
        }

        return this._isExpense;
    }

    public set absoluteAmount(value: string) {
        if (value === null) {
            return;
        }

        let amount = parseFloat(value.replace(',', '.'));
        if (isNaN(amount)) {
            amount = 0;
        }

        const absoluteAmount = Math.abs(amount);
        this.amount = this.isExpense ? absoluteAmount * -1 : absoluteAmount;
    }

    public set isExpense(value: boolean) {
        this._isExpense = value;

        if ((value && this.amount > 0) || (!value && this.amount <= 0)) {
            this.amount *= -1;
        }
    }
}
