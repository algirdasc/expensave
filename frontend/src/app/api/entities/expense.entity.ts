import {Expose, Type} from 'class-transformer';
import {Calendar} from './calendar.entity';
import {Category} from './category.entity';
import {EntityInterface} from './entity.interface';
import {User} from './user.entity';

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
    public category: Category|null;

    @Expose()
    public confirmed: boolean;

    @Expose()
    public description: string;

    // TODO: hide this from serialization
    private _isExpense: boolean = true;

    get absoluteAmount(): number|undefined {
        return this.amount ? Math.abs(this.amount) : undefined;
    }

    set absoluteAmount(value: number) {
        const absoluteValue = Math.abs(value);
        this.amount = this.isExpense ? absoluteValue * -1 : absoluteValue;
    }

    get isExpense(): boolean {
        return this._isExpense;
    }

    set isExpense(value: boolean) {
        this._isExpense = value;

        const absoluteValue = Math.abs(this.amount ?? 0);
        this.amount = this._isExpense ? absoluteValue * -1 : absoluteValue;
    }
}
