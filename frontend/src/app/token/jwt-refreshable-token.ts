import {NbAuthJWTToken} from '@nebular/auth';
import {NbAuthRefreshableToken} from '@nebular/auth/services/token/token';

export class JwtRefreshableToken extends NbAuthJWTToken implements NbAuthRefreshableToken{
    public static NAME: string = 'app:auth:jwt:token';
    protected refreshToken: string;

    public getPayload(): any {
        console.log('here!');

        return super.getPayload();
    }

    public getRefreshToken(): string {
        return this.refreshToken;
    }

    public setRefreshToken(refreshToken: string): any {
        this.refreshToken = refreshToken;
    }
}
