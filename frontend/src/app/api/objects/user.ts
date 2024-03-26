import {Expose, Type} from 'class-transformer';
import {sha256} from 'js-sha256';
import {EntityInterface} from '../../interfaces/entity.interface';
import {Calendar} from './calendar';

export class User implements EntityInterface {
  @Expose()
  public id: number;

  @Expose()
  public name: string;

  @Expose()
  public email: string;

  @Expose()
  @Type(() => Calendar)
  public calendars: Calendar[];

  get avatar(): string {
      const email = this.email?.trim().toLowerCase() ?? '';

      return `https://www.gravatar.com/avatar/${sha256(email)}`;
  }
}
