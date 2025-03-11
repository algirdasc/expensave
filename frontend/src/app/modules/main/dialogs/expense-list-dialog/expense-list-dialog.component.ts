import { Component, OnInit } from '@angular/core';
import { NbDialogRef, NbCardModule, NbButtonModule, NbIconModule } from '@nebular/theme';
import { Calendar } from '../../../../api/objects/calendar';
import { Expense } from '../../../../api/objects/expense';
import { CalendarService } from '../../calendar/calendar.service';
import { NgIf, DatePipe } from '@angular/common';
import { ExpenseListItemsComponent } from './expense-list-items.component';
import { ShortNumberPipe } from '../../../../pipes/shortnumber.pipe';

@Component({
    templateUrl: 'expense-list-dialog.component.html',
    styleUrls: ['expense-list-dialog.component.scss'],
    imports: [NbCardModule, NgIf, ExpenseListItemsComponent, NbButtonModule, NbIconModule, DatePipe, ShortNumberPipe],
})
export class ExpenseListDialogComponent implements OnInit {
    public visibleDate: Date;
    public expenses: Expense[];
    public calendar: Calendar;
    public confirmedExpenses: Expense[];
    public unconfirmedExpenses: Expense[];
    public totalExpensesAmount: number = 0;
    public calendarService: CalendarService;

    public constructor(private dialogRef: NbDialogRef<ExpenseListDialogComponent>) {}

    public ngOnInit(): void {
        this.confirmedExpenses = this.expenses.filter((expense: Expense) => expense.confirmed);
        this.unconfirmedExpenses = this.expenses.filter((expense: Expense) => !expense.confirmed);

        this.expenses.forEach((expense: Expense) => {
            this.totalExpensesAmount += expense.amount;
        });
    }

    public createExpense(): void {
        this.calendarService.createExpense(this.calendar, this.visibleDate);
        this.dialogRef.close();
    }

    public editExpense(expense: Expense): void {
        this.calendarService.editExpense(expense);
        this.dialogRef.close();
    }
}
