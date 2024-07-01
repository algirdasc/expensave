import { Inject, Injectable } from '@angular/core';
import { getDeepFromObject, NB_AUTH_OPTIONS } from '@nebular/auth';

@Injectable()
export class AuthOptionsService {
    public constructor(@Inject(NB_AUTH_OPTIONS) protected options = {}) {}

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public getConfigValue(key: string): any {
        return getDeepFromObject(this.options, key, null);
    }
}
