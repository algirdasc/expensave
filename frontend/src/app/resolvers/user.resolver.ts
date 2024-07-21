import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../api/objects/user';
import { UserApiService } from '../api/user.api.service';

@Injectable()
export class UserResolver {
    public constructor(private readonly userApiService: UserApiService) {}

    public resolve(): Observable<User> {
        return this.userApiService.profile();
    }
}
