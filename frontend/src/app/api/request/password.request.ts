import {Expose} from 'class-transformer';

export class PasswordRequest {
    @Expose()
    public currentPassword: string;

    @Expose()
    public newPassword: string;

    @Expose()
    public confirmPassword: string;
}
