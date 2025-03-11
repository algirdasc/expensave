import { Component } from '@angular/core';
import { NavigationEnd, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { NbDateService, NbLayoutModule, NbSpinnerModule } from '@nebular/theme';

@Component({
    selector: 'app-root',
    template: `<nb-layout>
        <nb-layout-column class="p-0" [nbSpinner]="isBusy" nbSpinnerStatus="primary" nbSpinnerSize="giant">
            <router-outlet></router-outlet>
        </nb-layout-column>
    </nb-layout>`,
    imports: [NbLayoutModule, NbSpinnerModule, RouterOutlet],
})
export class AppComponent {
    public isBusy: boolean = true;

    public constructor(
        private router: Router,
        private dateService: NbDateService<Date>
    ) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.router.events.subscribe((event: any) => {
            if (event instanceof NavigationEnd) {
                this.isBusy = false;
            }

            if (event instanceof NavigationStart) {
                this.isBusy = true;
            }
        });
    }
}
