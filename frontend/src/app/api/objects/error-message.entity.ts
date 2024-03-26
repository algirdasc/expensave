import {Expose} from 'class-transformer';

export class ErrorMessage {
  @Expose()
  public message: string;

  @Expose()
  public propertyPath?: string;
}
