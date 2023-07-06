import {Expose} from 'class-transformer';

export class Error {
    @Expose()
    public throwable: string;

    @Expose()
    public messages: string[];
}