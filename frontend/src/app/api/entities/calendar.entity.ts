import {Expose, Type} from 'class-transformer';
import {EntityInterface} from './entity.interface';
import {User} from './user.entity';

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
  public users: User[];
}
