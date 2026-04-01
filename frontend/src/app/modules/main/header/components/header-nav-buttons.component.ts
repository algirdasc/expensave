import { Component, inject } from '@angular/core';
import { NbButtonGroupModule, NbButtonModule, NbDateService, NbIconModule } from '@nebular/theme';
import { DateUtil } from '../../../../util/date.util';
import { ActivatedRoute, Router } from '@angular/router';
import { MainStore } from '../../main.store';

@Component({
    selector: 'app-header-nav-buttons',
    template: `
        <nb-button-group status="primary" class="d-none d-sm-block mx-3">
            <button nbButton (click)="changeVisibleMonth(-1)">
                <nb-icon icon="arrow-back-outline"></nb-icon>
            </button>

            <button nbButton (click)="navigateToday()">TODAY</button>

            <button nbButton (click)="changeVisibleMonth(1)">
                <nb-icon icon="arrow-forward-outline"></nb-icon>
            </button>
        </nb-button-group>
    `,
    imports: [NbButtonGroupModule, NbButtonModule, NbIconModule],
})
export class HeaderNavButtonsComponent {
    router = inject(Router);
    mainStore = inject(MainStore);
    activatedRoute = inject(ActivatedRoute);
    dateService = inject<NbDateService<Date>>(NbDateService);

    navigateToDate(date?: Date): void {
        this.router.navigate(['.'], {
            relativeTo: this.activatedRoute,
            queryParams: { date: this.dateService.format(date, DateUtil.MONTH_DAY_FORMAT) },
            queryParamsHandling: 'merge',
            replaceUrl: true,
        });
    }

    navigateToday(): void {
        this.navigateToDate(new Date());
    }

    changeVisibleMonth(direction: number): void {
        this.navigateToDate(this.dateService.addMonth(this.mainStore.selectedMonth(), direction));
    }
}
