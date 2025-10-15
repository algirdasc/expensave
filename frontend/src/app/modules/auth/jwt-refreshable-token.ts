import { NbAuthOAuth2JWTToken, NbAuthRefreshableToken } from '@nebular/auth';

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
