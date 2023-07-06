import {Expose} from 'class-transformer';
import {EntityInterface} from './entity.interface';

export class Category implements EntityInterface {
    @Expose()
    public id: number;

    @Expose()
    public name: string;

    @Expose()
    public color: string;
}