import {Component} from '@angular/core';
import {Calendar} from '../../../../api/entities/calendar.entity';
import {Category} from '../../../../api/entities/category.entity';
import {Expense} from '../../../../api/entities/expense.entity';
import {ExpenseApiService} from '../../../../api/expense.api.service';
import {NbDialogRef, NbDialogService} from '@nebular/theme';
import {CalendarsDialogComponent} from '../calendars-dialog/calendars-dialog.component';
import {CategoriesDialogComponent} from '../categories-dialog/categories-dialog.component';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';
import {DatepickerDialogComponent} from '../datepicker-dialog/datepicker-dialog.component';
import {InputDialogComponent} from '../input-dialog/input-dialog.component';

@Component({
    templateUrl: 'expense-dialog.component.html',
    styleUrls: ['expense-dialog.component.scss']
})
export class ExpenseDialogComponent {
    public expense: Expense;
    public calendars: Calendar[];
    public isBusy: boolean = false;

    constructor(
        private readonly expenseApiService: ExpenseApiService,
        private readonly dialogRef: NbDialogRef<ExpenseDialogComponent>,
        private dialogService: NbDialogService
    ) { }

    public onSubmit(): void {
        this.expenseApiService
            .save(this.expense)
            .subscribe((expense: Expense) => {
                this.dialogRef.close(expense);
            })
        ;
    }
    public selectCalendar(): void {
        this.dialogService
            .open(CalendarsDialogComponent, {
                context: {
                    selectedCalendar: this.expense.calendar,
                }
            })
            .onClose
            .subscribe((result: Calendar) => {
                if (result) {
                    this.expense.calendar = result;
                }
            });
    }

    public selectCategory(): void {
        this.dialogService
            .open(CategoriesDialogComponent, {
                context: {
                    selectedCategory: this.expense.category
                }
            })
            .onClose
            .subscribe((result: Category) => {
                if (result) {
                    this.expense.category = result;
                }
            });
    }

    public addDescription(): void {
        this.dialogService
            .open(InputDialogComponent, {
                context: {
                    title: 'Transaction description',
                    text: this.expense.description,
                    placeholder: 'Add details about this transaction',
                }
            })
            .onClose
            .subscribe((result: string) => this.expense.description = result);
    }

    public selectDateTime(): void {
        this.dialogService
            .open(DatepickerDialogComponent, {
                context: {
                    date: this.expense.createdAt,
                }
            })
            .onClose
            .subscribe((result: Date) => {
                if (result) {
                    this.expense.createdAt = result;
                }
            });
    }

    public deleteExpense(): void {
        this.dialogService
            .open(ConfirmDialogComponent, {
                context: {
                    question: 'Are you sure you want delete this transaction?',
                }
            })
            .onClose
            .subscribe((result: boolean) => {
                if (result) {
                    this.expenseApiService
                        .delete(this.expense.id)
                        .subscribe(() => this.dialogRef.close(true));
                }
            });
    }
}
