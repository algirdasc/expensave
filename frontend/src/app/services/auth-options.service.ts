import { Injectable, inject } from '@angular/core';
import { getDeepFromObject, NB_AUTH_OPTIONS } from '@nebular/auth';

@Injectable()
export class AuthOptionsService {
    protected options = inject(NB_AUTH_OPTIONS) ?? {};

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public getConfigValue(key: string): any {
        return getDeepFromObject(this.options, key, null);
    }
}
