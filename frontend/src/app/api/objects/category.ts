import { Expose } from 'class-transformer';
import { EntityInterface } from '../../interfaces/entity.interface';

export const BALANCE_UPDATE = 'balance_update';
export const TRANSFER = 'transfer';
export const UNCATEGORIZED = 'uncategorized';

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
