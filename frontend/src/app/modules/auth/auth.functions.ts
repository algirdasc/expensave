import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { NbAuthService } from '@nebular/auth';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export const canActivateAuthenticated: CanActivateFn = (): Observable<boolean> => {
    const authService: NbAuthService = inject(NbAuthService);
    const router: Router = inject(Router);

    return authService.isAuthenticatedOrRefresh().pipe(
        tap((authenticated: boolean) => {
            if (!authenticated) {
                router.navigate(['auth/login']);
            }
        })
    );
};
