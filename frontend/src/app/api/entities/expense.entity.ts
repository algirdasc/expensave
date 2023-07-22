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
    public category: Category;

    @Expose()
    public confirmed: boolean;

    @Expose()
    public description: string;
}
