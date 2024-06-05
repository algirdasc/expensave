import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { NbDialogRef, NbDialogService, NbTabComponent } from '@nebular/theme';
import { ExpenseApiService } from '../../../../api/expense.api.service';
import { Calendar } from '../../../../api/objects/calendar';
import { Category } from '../../../../api/objects/category';
import { Expense } from '../../../../api/objects/expense';
import { UNCATEGORIZED_COLOR } from '../../../../util/color.util';
import { CalendarsDialogComponent } from '../calendars-dialog/calendars-dialog.component';
import { CategoriesDialogComponent } from '../categories-dialog/categories-dialog.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { InputDialogComponent } from '../input-dialog/input-dialog.component';

@Component({
    templateUrl: 'expense-dialog.component.html',
    styleUrls: ['expense-dialog.component.scss'],
})
export class ExpenseDialogComponent implements AfterViewInit {
    public expense: Expense;
    public isBusy: boolean = false;

    private apiMethod: string = 'save';

    @ViewChild('focus') private focusElement: ElementRef;

    constructor(
        private readonly expenseApiService: ExpenseApiService,
        private readonly dialogRef: NbDialogRef<ExpenseDialogComponent>,
        private dialogService: NbDialogService
    ) {}

    public ngAfterViewInit(): void {
        // this.focusElement.nativeElement.focus();
    }

    public onSubmit(): void {
        this.expenseApiService[this.apiMethod](this.expense).subscribe((expense: Expense) => {
            this.dialogRef.close(expense);
        });
    }
    public selectCalendar(): void {
        this.dialogService
            .open(CalendarsDialogComponent, {
                context: {
                    selectedCalendar: this.expense.calendar,
                },
            })
            .onClose.subscribe((result?: Calendar) => {
                if (result) {
                    this.expense.calendar = result;
                }
            });
    }

    public selectCategory(): void {
        this.dialogService
            .open(CategoriesDialogComponent, {
                context: {
                    selectedCategory: this.expense.category,
                },
            })
            .onClose.subscribe((result: Category | null) => {
                if (result !== undefined) {
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
                },
            })
            .onClose.subscribe((result: string) => {
                if (result !== undefined) {
                    this.expense.description = result;
                }
            });
    }

    public deleteExpense(): void {
        this.dialogService
            .open(ConfirmDialogComponent, {
                context: {
                    question: 'Are you sure you want delete this transaction?',
                },
            })
            .onClose.subscribe((result?: boolean) => {
                if (result) {
                    this.expenseApiService.delete(this.expense.id).subscribe(() => this.dialogRef.close(true));
                }
            });
    }

    public onTabChange(event: NbTabComponent): void {
        this.apiMethod = event.tabId;
    }
}
