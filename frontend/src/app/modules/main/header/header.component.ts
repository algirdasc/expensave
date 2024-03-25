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
    @Input() public selectedValue: Date;
    @Input() public monthBalance: number = 0;
    @Output() public selectedValueChange: EventEmitter<Date> = new EventEmitter<Date>();
    public viewMode: typeof NbCalendarViewMode = NbCalendarViewMode;
    private _activeViewMode: NbCalendarViewMode = NbCalendarViewMode.DATE;

    constructor(
        private readonly dateService: NbDateService<Date>,
        private readonly sidebarService: NbSidebarService,
    ) { }

    get activeViewMode(): NbCalendarViewMode {
        return this._activeViewMode;
    }

    set activeViewMode(value: NbCalendarViewMode) {
        this._activeViewMode = value;

        if (this._activeViewMode === this.viewMode.DATE) {
            this.selectedValueChange.emit(this.selectedValue);
        }
    }

    public toggleSidebar(): void {
        this.sidebarService.toggle(false, 'menu-sidebar');
    }

    public changeViewMode(): void {
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
        this.selectedValue = new Date();
        this.selectedValueChange.emit(this.selectedValue);
    }

    private changeVisibleMonth(direction: number): void {
        this.selectedValue = this.dateService.addMonth(this.selectedValue, direction);
        this.selectedValueChange.emit(this.selectedValue);
    }
}
