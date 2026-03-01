import { Component, EventEmitter, inject, Input, Output, QueryList, ViewChildren } from '@angular/core';
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

@Component({
    selector: 'app-header-date-picker',
    template: `
        <div appOutsideClick (outsideClick)="onOutsideClick()">
            <nb-calendar-view-mode
                [date]="visibleDate"
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
                            [year]="visibleDate"
                            (yearChange)="visibleDate = $event; activeViewMode = viewMode.MONTH">
                        </nb-calendar-year-picker>
                    }
                    @case (viewMode.MONTH) {
                        <nb-calendar-month-picker
                            [month]="visibleDate"
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
    private readonly dateService = inject<NbDateService<Date>>(NbDateService);

    @Input({ required: true }) public visibleDate: Date;
    @Output() public dateNavigate = new EventEmitter<Date>();

    @ViewChildren(NbPopoverDirective)
    private popovers: QueryList<NbPopoverDirective>;

    protected readonly viewMode: typeof NbCalendarViewMode = NbCalendarViewMode;
    protected activeViewMode: NbCalendarViewMode = NbCalendarViewMode.DATE;

    protected onOutsideClick(): void {
        // restore current date selection + close popovers by resetting view mode
        this.navigateToDate(this.visibleDate);
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
        this.dateNavigate.emit(date);
    }

    // Convenience for parent usage (keeps formatting logic local if needed later)
    protected formatMonthDay(date?: Date): string {
        return this.dateService.format(date, DateUtil.MONTH_DAY_FORMAT);
    }
}
