import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import {
    Event,
    NavigationCancel,
    NavigationEnd,
    NavigationError,
    NavigationStart,
    Router,
    RouterOutlet,
} from '@angular/router';
import { NbLayoutModule, NbSpinnerModule } from '@nebular/theme';

@Component({
    selector: 'app-root',
    template: `<nb-layout>
        <nb-layout-column class="p-0" [nbSpinner]="isBusy" nbSpinnerStatus="primary" nbSpinnerSize="giant">
            <router-outlet></router-outlet>
        </nb-layout-column>
    </nb-layout>`,
    imports: [NbLayoutModule, NbSpinnerModule, RouterOutlet],
})
export class AppComponent implements OnInit {
    private readonly destroyRef = inject(DestroyRef);
    private readonly router = inject(Router);

    public isBusy = true;

    public ngOnInit(): void {
        this.router.events.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((event: Event) => {
            if (event instanceof NavigationStart) {
                this.isBusy = true;
                return;
            }

            if (
                event instanceof NavigationEnd ||
                event instanceof NavigationCancel ||
                event instanceof NavigationError
            ) {
                this.isBusy = false;
            }
        });
    }
}
