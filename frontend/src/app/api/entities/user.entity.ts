import {Expose, Type} from 'class-transformer';
import {Calendar} from './calendar.entity';
import {EntityInterface} from './entity.interface';

export class User implements EntityInterface{
  @Expose()
  public id: number;

  @Expose()
  public name: string;

  @Expose()
  public email: string;

  @Expose()
  public avatar: string;

  @Expose()
  @Type(() => Calendar)
  public calendars: Calendar[];
}
