import { Component, EventEmitter, Input, Output, QueryList, ViewChildren } from '@angular/core';
import {
    NbButtonGroupModule,
    NbButtonModule,
    NbCalendarKitModule,
    NbCalendarViewMode,
    NbIconModule,
    NbPopoverDirective,
    NbPopoverModule,
} from '@nebular/theme';
import { OutsideClickDirective } from '../../../../../directives/outside-click.directive';

@Component({
    selector: 'app-date-navigation',
    templateUrl: 'date-navigation.component.html',
    styleUrl: 'date-navigation.component.scss',
    imports: [
        NbCalendarKitModule,
        NbPopoverModule,
        NbButtonGroupModule,
        NbButtonModule,
        NbIconModule,
        OutsideClickDirective,
    ],
})
export class DateNavigationComponent {
    @Input()
    public currentDate: Date;

    @Output()
    public dateChange: EventEmitter<Date> = new EventEmitter<Date>();

    @Output()
    public previous: EventEmitter<void> = new EventEmitter<void>();

    @Output()
    public next: EventEmitter<void> = new EventEmitter<void>();

    @Output()
    public today: EventEmitter<void> = new EventEmitter<void>();

    @ViewChildren(NbPopoverDirective)
    private popovers: QueryList<NbPopoverDirective>;

    public viewMode: typeof NbCalendarViewMode = NbCalendarViewMode;
    public activeViewMode: NbCalendarViewMode = NbCalendarViewMode.DATE;

    public changeViewMode(): void {
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

    public onYearChange(date: Date): void {
        this.currentDate = date;
        this.activeViewMode = NbCalendarViewMode.MONTH;
    }

    public onMonthChange(date: Date): void {
        this.dateChange.emit(date);
        this.activeViewMode = NbCalendarViewMode.DATE;
    }

    public handleOutsideClick(): void {
        this.dateChange.emit(this.currentDate);
        this.activeViewMode = NbCalendarViewMode.DATE;
    }

    public onPrevious(): void {
        this.previous.emit();
    }

    public onNext(): void {
        this.next.emit();
    }

    public onToday(): void {
        this.today.emit();
    }
}
