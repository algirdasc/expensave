import { Expose, Type } from 'class-transformer';
import { EntityInterface } from '../../interfaces/entity.interface';
import { Calendar } from './calendar';
import { Category } from './category';
import { User } from './user';

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
    public category: Category | null;

    @Expose()
    public confirmed: boolean;

    @Expose()
    public description?: string;

    private _isExpense: boolean;

    public get absoluteAmount(): number {
        return this.amount ? Math.abs(this.amount) : undefined;
    }

    public set absoluteAmount(value: number) {
        if (value === null) {
            return;
        }

        const absoluteValue = Math.abs(value);
        this.amount = this.isExpense ? absoluteValue * -1 : absoluteValue;
    }

    public get isExpense(): boolean {
        if (this._isExpense === undefined) {
            this._isExpense = !(this.amount > 0);
        }

        return this._isExpense;
    }

    public set isExpense(value: boolean) {
        this._isExpense = value;

        if ((value && this.amount > 0) || (!value && this.amount <= 0)) {
            this.amount *= -1;
        }
    }
}
