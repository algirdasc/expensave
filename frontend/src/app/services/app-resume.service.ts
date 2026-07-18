import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';
import { TokenRefreshService } from './token-refresh.service';

/**
 * Proactively refreshes the access token when the app returns from background.
 *
 * On mobile PWAs the access token (10 min TTL) is usually expired by the time
 * the user comes back. Refreshing on the visibilitychange event, before the
 * first API call fires, keeps the session alive and avoids the refresh race.
 */
@Injectable({ providedIn: 'root' })
export class AppResumeService {
    private tokenRefreshService = inject(TokenRefreshService);
    private destroyRef = inject(DestroyRef);

    public initialize(): void {
        fromEvent(document, 'visibilitychange')
            .pipe(
                filter(() => !document.hidden),
                switchMap(() => this.tokenRefreshService.isAuthenticatedOrRefresh()),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe();
    }
}
