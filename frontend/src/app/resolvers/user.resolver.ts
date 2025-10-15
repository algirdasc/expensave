import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../api/objects/user';
import { UserApiService } from '../api/user.api.service';

@Injectable()
export class UserResolver {
    private readonly userApiService = inject(UserApiService);


    public resolve(): Observable<User> {
        return this.userApiService.profile();
    }
}
