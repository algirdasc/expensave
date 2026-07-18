import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TokenRefreshService } from '../../services/token-refresh.service';

export const canActivateAuthenticated: CanActivateFn = (): Observable<boolean> => {
    const tokenRefreshService: TokenRefreshService = inject(TokenRefreshService);
    const router: Router = inject(Router);

    return tokenRefreshService.isAuthenticatedOrRefresh().pipe(
        tap((authenticated: boolean) => {
            if (!authenticated) {
                router.navigate(['auth/login']);
            }
        })
    );
};
