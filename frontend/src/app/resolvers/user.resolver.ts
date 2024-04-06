import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {User} from '../api/objects/user';
import {UserApiService} from '../api/user.api.service';

@Injectable()
export class UserResolver  {
    constructor(private readonly userApiService: UserApiService) { }

    public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<User> {
        return this.userApiService.profile();
    }
}
