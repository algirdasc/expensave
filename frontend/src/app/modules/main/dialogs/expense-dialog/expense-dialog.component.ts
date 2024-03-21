import {Component} from '@angular/core';
import {NbDialogRef, NbDialogService} from '@nebular/theme';
import {Subscription} from 'rxjs';
import {Calendar} from '../../../../api/entities/calendar.entity';
import {Category} from '../../../../api/entities/category.entity';
import {Expense} from '../../../../api/entities/expense.entity';
import {ExpenseApiService} from '../../../../api/expense.api.service';
import {ExpenseSuggestResponse} from '../../../../api/response/expense-suggest.response';
import {UNCATEGORIZED_COLOR} from '../../../../util/color.util';
import {DateUtil} from '../../../../util/date.util';
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
    public expenseSuggestionResponse: ExpenseSuggestResponse;

    protected readonly UNCATEGORIZED_COLOR: string = UNCATEGORIZED_COLOR;

    private labelSuggestionSubscription: Subscription;

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
                    this.expense.createdAt = DateUtil.setTime(result, this.expense.createdAt);
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

    public handleInputChange(input: string): void {
        // 1. Deselect category when input change & is not equal to suggestion (new expense only)
        if (this.expense.id === undefined && input !== this.expenseSuggestionResponse?.label) {
            this.expense.category = undefined;
        }

        // 2. Delete expired suggestion
        this.expenseSuggestionResponse = undefined;

        // 3. Cancel pending suggestion request
        if (this.labelSuggestionSubscription) {
            this.labelSuggestionSubscription.unsubscribe();
        }

        // 4. Do not look for suggestion on empty input
        if (!input) {
            return;
        }

        // 5. Search for suggestions
        this.labelSuggestionSubscription = this.expenseApiService
            .suggest(input)
            .subscribe((response: ExpenseSuggestResponse) => {
                this.expenseSuggestionResponse = response;
            });
    }

    public applyLabelSuggestion(): void {
        this.expense.label = this.expenseSuggestionResponse.label;
        this.expense.category = this.expenseSuggestionResponse.category;
    }
}
