import { Expose } from 'class-transformer';
import { EntityInterface } from '../../interfaces/entity.interface';

export const TYPE_BALANCE_UPDATE = 'balance_update';
export const TYPE_UNCATEGORIZED = 'uncategorized';

export class Category implements EntityInterface {
    @Expose()
    public id: number;

    @Expose()
    public name: string;

    @Expose()
    public color: string;

    @Expose()
    public icon: string;

    @Expose()
    public definedByUser: boolean;

    @Expose()
    public type: string;
}
