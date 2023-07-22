import {Expose, Type} from 'class-transformer';
import {ErrorMessage} from './errormessage.entity';

export class Error {
    @Expose()
    public throwable: string;

    @Expose()
    @Type(() => ErrorMessage)
    public messages: ErrorMessage[];
}
