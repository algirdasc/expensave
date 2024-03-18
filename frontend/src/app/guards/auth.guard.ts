import {Injectable} from '@angular/core';
import { Router } from '@angular/router';
import {NbAuthService} from '@nebular/auth';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';

@Injectable()
export class AuthGuard {
    constructor(private authService: NbAuthService, private router: Router) { }

    public canLoad(): Observable<boolean> {
        return this.authService
            .isAuthenticated()
            .pipe(
                tap((authenticated: boolean) => {
                    if (!authenticated) {
                        this.router.navigate(['auth/login']);
                    }
                }),
            );
    }
}
