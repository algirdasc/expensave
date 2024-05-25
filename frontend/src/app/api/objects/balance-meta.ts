import { Expose } from 'class-transformer';

export class BalanceMeta {
    @Expose()
    public income: number;

    @Expose()
    public expense: number;

    @Expose()
    public change: number;
}
