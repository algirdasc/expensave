import {Component} from '@angular/core';
import {NbCalendarDayCellComponent, NbDateService} from '@nebular/theme';
import {Calendar} from 'src/app/api/entities/calendar.entity';
import {Expense} from 'src/app/api/entities/expense.entity';
import {Balance} from 'src/app/api/response/calendar-expense-list.response';
import {CalendarCellInterface} from '../interfaces/calendar-cell.interface';

@Component({
    templateUrl: 'calendar-grid-row-cell-mobile.component.html',
    styleUrls: ['calendar-grid-row-cell-mobile.component.scss']
})
export class CalendarGridRowCellMobileComponent extends NbCalendarDayCellComponent<Date> implements CalendarCellInterface {
    public expenses: Expense[];
    public balance: Balance;
    public calendar: Calendar;
    public hasUnconfirmedExpenses: boolean = false;

    public constructor(public dateService: NbDateService<Date>) {
        super(dateService);
    }

    get isCellSelected(): boolean {
        return this.dateService.isSameDaySafe(this.selectedValue, this.date);
    }
}
