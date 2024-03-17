import {Injectable} from '@angular/core';
import {
    NbAuthResult,
    NbAuthStrategyClass,
    NbPasswordAuthStrategy,
    NbPasswordAuthStrategyOptions,
    passwordStrategyOptions
} from '@nebular/auth';
import {Observable} from 'rxjs';

@Injectable()
export class TestStrategy extends NbPasswordAuthStrategy {
    protected defaultOptions: NbPasswordAuthStrategyOptions = passwordStrategyOptions;

    static setup(options: NbPasswordAuthStrategyOptions): [NbAuthStrategyClass, NbPasswordAuthStrategyOptions] {
        return [TestStrategy, options];
    }
    public authenticate(data?: any): Observable<NbAuthResult> {
        console.log('auth', data);
        return super.authenticate(data);
    }

    public refreshToken(data?: any): Observable<NbAuthResult> {
        console.log('refresh', data);
        return super.refreshToken(data);
    }
}
