import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NbCalendarViewMode, NbDateService, NbSidebarService} from '@nebular/theme';
import {Calendar} from '../../../api/entities/calendar.entity';

@Component({
    templateUrl: 'header.component.html',
    styleUrls: ['header.component.scss'],
    selector: 'app-header',
})
export class HeaderComponent {
    @Input() public calendar: Calendar;
    @Input() public selectedDate: Date;
    @Output() public selectedDateChange: EventEmitter<Date> = new EventEmitter<Date>();
    public viewMode: typeof NbCalendarViewMode = NbCalendarViewMode;
    private _activeViewMode: NbCalendarViewMode = NbCalendarViewMode.DATE;

    constructor(
        private readonly dateService: NbDateService<Date>,
        private readonly nbSidebarService: NbSidebarService
    ) { }

    get activeViewMode(): NbCalendarViewMode {
        return this._activeViewMode;
    }

    set activeViewMode(value: NbCalendarViewMode) {
        this._activeViewMode = value;

        if (this._activeViewMode === this.viewMode.DATE) {
            this.selectedDateChange.emit(this.selectedDate);
        }
    }

    public toggleSidebar(): void {
        this.nbSidebarService.toggle(false, 'menu-sidebar');
    }

    public onClick(): void {
        console.log('heee');
    }

    public onChangeViewMode(): void {
        if (this._activeViewMode === NbCalendarViewMode.DATE) {
            this._activeViewMode = NbCalendarViewMode.YEAR;

            return;
        }

        this._activeViewMode = NbCalendarViewMode.DATE;
    }

    public navigatePrev(): void {
        this.changeVisibleMonth(-1);
    }

    public navigateNext(): void {
        this.changeVisibleMonth(1);
    }

    public navigateToday(): void {
        this.selectedDate = new Date();
        this.selectedDateChange.emit(this.selectedDate);
    }

    private changeVisibleMonth(direction: number): void {
        this.selectedDate = this.dateService.addMonth(this.selectedDate, direction);
        this.selectedDateChange.emit(this.selectedDate);
    }
}
