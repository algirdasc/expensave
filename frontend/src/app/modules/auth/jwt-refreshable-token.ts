import { NbAuthOAuth2JWTToken } from '@nebular/auth';
import { NbAuthRefreshableToken } from '@nebular/auth/services/token/token';

export class JwtRefreshableToken extends NbAuthOAuth2JWTToken implements NbAuthRefreshableToken {
    public static NAME: string = 'app:auth:jwt:token';

    public getValue(): string {
        return this.token.token;
    }

    public getRefreshToken(): string {
        return this.token.refreshToken;
    }

    public setRefreshToken(refreshToken: string): void {
        this.token.refreshToken = refreshToken;
    }
}
