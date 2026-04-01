import { Component, inject, QueryList, ViewChildren } from '@angular/core';
import {
    NbButtonGroupModule,
    NbCalendarKitModule,
    NbCalendarViewMode,
    NbDateService,
    NbPopoverDirective,
    NbPopoverModule,
} from '@nebular/theme';
import { DateUtil } from '../../../../util/date.util';
import { OutsideClickDirective } from '../../../../directives/outside-click.directive';
import { MainStore } from '../../main.store';

@Component({
    selector: 'app-header-date-picker',
    template: `
        <div appOutsideClick (outsideClick)="onOutsideClick()">
            <nb-calendar-view-mode
                [date]="mainStore.selectedMonth()"
                [viewMode]="activeViewMode"
                [nbPopover]="viewModeRef"
                nbPopoverContext="viewModePopover"
                nbPopoverTrigger="noop"
                nbPopoverPlacement="bottom"
                (changeMode)="changeViewMode()">
            </nb-calendar-view-mode>

            <ng-template #viewModeRef>
                @switch (activeViewMode) {
                    @case (viewMode.YEAR) {
                        <nb-calendar-year-picker
                            [year]="mainStore.selectedMonth()"
                            (yearChange)="activeViewMode = viewMode.MONTH">
                        </nb-calendar-year-picker>
                    }
                    @case (viewMode.MONTH) {
                        <nb-calendar-month-picker
                            [month]="mainStore.selectedMonth()"
                            (monthChange)="navigateToDate($event); activeViewMode = viewMode.DATE">
                        </nb-calendar-month-picker>
                    }
                }
            </ng-template>
        </div>
    `,
    imports: [OutsideClickDirective, NbCalendarKitModule, NbPopoverModule, NbButtonGroupModule],
})
export class HeaderDatePickerComponent {
    dateService = inject<NbDateService<Date>>(NbDateService);
    mainStore = inject(MainStore);

    @ViewChildren(NbPopoverDirective)
    private popovers: QueryList<NbPopoverDirective>;

    protected readonly viewMode: typeof NbCalendarViewMode = NbCalendarViewMode;
    protected activeViewMode: NbCalendarViewMode = NbCalendarViewMode.DATE;

    // constructor() {
    //     effect(() => {});
    // }

    protected onOutsideClick(): void {
        // restore current date selection + close popovers by resetting view mode
        // this.navigateToDate(this.visibleDate);
        this.activeViewMode = this.viewMode.DATE;
    }

    protected changeViewMode(): void {
        if (this.activeViewMode === NbCalendarViewMode.DATE) {
            this.activeViewMode = NbCalendarViewMode.YEAR;
            const viewModePopover: NbPopoverDirective = this.popovers.find(
                element => element.context === 'viewModePopover'
            );
            viewModePopover.show();
        } else {
            this.activeViewMode = NbCalendarViewMode.DATE;
        }
    }

    protected navigateToDate(date?: Date): void {
        // this.dateNavigate.emit(date);
    }

    // Convenience for parent usage (keeps formatting logic local if needed later)
    protected formatMonthDay(date?: Date): string {
        return this.dateService.format(date, DateUtil.MONTH_DAY_FORMAT);
    }
}
