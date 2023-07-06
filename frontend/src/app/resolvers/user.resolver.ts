import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {User} from '../api/entities/user.entity';
import {UserApiService} from '../api/user.api.service';

@Injectable()
export class UserResolver implements Resolve<User> {
    constructor(private readonly userApiService: UserApiService) { }

    public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<User> {
        return this.userApiService.profile();
    }
}
