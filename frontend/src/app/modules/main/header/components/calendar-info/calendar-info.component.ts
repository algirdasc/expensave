import { Component, Input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { NbPopoverModule } from '@nebular/theme';
import { Calendar } from '../../../../../api/objects/calendar';
import { ExpenseReportComponent } from '../../../components/expense-report/expense-report.component';
import { ShortNumberPipe } from '../../../../../pipes/shortnumber.pipe';

@Component({
    selector: 'app-calendar-info',
    templateUrl: 'calendar-info.component.html',
    styleUrl: 'calendar-info.component.scss',
    imports: [NbPopoverModule, DecimalPipe, ShortNumberPipe],
})
export class CalendarInfoComponent {
    @Input()
    public calendar: Calendar;

    @Input()
    public monthBalance: number;

    protected readonly expenseReportComponent = ExpenseReportComponent;
}
