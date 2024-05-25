import { Expose, Type } from 'class-transformer';
import { EntityInterface } from '../../interfaces/entity.interface';
import { User } from './user';

export class Calendar implements EntityInterface {
    @Expose()
    public id: number;

    @Expose()
    public name: string;

    @Expose()
    public shared: boolean;

    @Expose()
    public balance: number;

    @Expose()
    @Type(() => User)
    public owner: User;

    @Expose()
    @Type(() => User)
    public collaborators: User[];

    public isOwner(user: User): boolean {
        return user.id === this.owner?.id;
    }

    public isDefault(user: User): boolean {
        return user.defaultCalendarId === this.id;
    }

    public hasCollaborator(user: User): boolean {
        return !!this.collaborators.filter(collaborator => collaborator.id === user.id).length;
    }

    public static create(user: User): Calendar {
        const calendar = new Calendar();
        calendar.owner = user;
        calendar.collaborators = [];

        return calendar;
    }
}
