import { Expose } from 'class-transformer';
import { sha256 } from 'js-sha256';
import { EntityInterface } from '../../interfaces/entity.interface';

export class User implements EntityInterface {
    @Expose()
    public id: number;

    @Expose()
    public name: string;

    @Expose()
    public email: string;

    @Expose()
    public defaultCalendarId?: number;

    public get avatar(): string {
        const email = this.email?.trim().toLowerCase() ?? '';

        return `https://www.gravatar.com/avatar/${sha256(email)}`;
    }
}
