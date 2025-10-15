import { Component, inject } from '@angular/core';
import { NbCalendarDayCellComponent, NbDateService } from '@nebular/theme';
import { Calendar } from '../../../../api/objects/calendar';
import { Expense } from '../../../../api/objects/expense';
import { ExpenseBalance } from '../../../../api/objects/expense-balance';
import { CalendarCellInterface } from '../interfaces/calendar-cell.interface';
import { NgIf } from '@angular/common';
import { ShortNumberPipe } from '../../../../pipes/shortnumber.pipe';

@Component({
    templateUrl: 'calendar-grid-row-cell-mobile.component.html',
    styleUrls: ['calendar-grid-row-cell-mobile.component.scss'],
    imports: [NgIf, ShortNumberPipe],
})
export class CalendarGridRowCellMobileComponent
    extends NbCalendarDayCellComponent<Date>
    implements CalendarCellInterface
{
    dateService: NbDateService<Date>;

    public expenses: Expense[];
    public expenseBalance: ExpenseBalance;
    public calendar: Calendar;
    public hasUnconfirmedExpenses: boolean = false;

    public constructor() {
        const dateService = inject<NbDateService<Date>>(NbDateService);

        super(dateService);
    
        this.dateService = dateService;
    }

    public get isCellSelected(): boolean {
        return this.dateService.isSameDaySafe(this.selectedValue, this.date);
    }
}
