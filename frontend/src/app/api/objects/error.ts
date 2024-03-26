import {Expose, Type} from 'class-transformer';
import {ErrorMessage} from './error-message.entity';

export class Error {
    @Expose()
    public throwable: string;

    @Expose()
    @Type(() => ErrorMessage)
    public messages: ErrorMessage[];
}
