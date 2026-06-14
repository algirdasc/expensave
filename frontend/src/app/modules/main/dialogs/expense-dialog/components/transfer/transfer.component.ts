import { Component, inject, ViewChild } from '@angular/core';
import { NbDialogRef, NbSpinnerModule } from '@nebular/theme';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { Calendar } from '../../../../../../api/objects/calendar';
import { Expense } from '../../../../../../api/objects/expense';
import { ExpenseQueries } from '../../../../../../queries/expense.queries';
import { ExpenseDialogComponent } from '../../expense-dialog.component';
import { AbstractExpenseComponent } from '../abstract-expense.component';
import { ExpenseInputComponent } from '../expense-input.component';
import { FormsModule } from '@angular/forms';
import { CalendarListItemComponent } from '../fields/calendar-list-item.component';
import { ConfirmedListItemComponent } from '../fields/confirmed-list-item.component';
import { CategoryListItemComponent } from '../fields/category-list-item.component';
import { DateListItemComponent } from '../fields/date-list-item.component';
import { DescriptionListItemComponent } from '../fields/description-list-item.component';
import { UserListItemComponent } from '../fields/user-list-item.component';
import { FooterComponent } from '../fields/footer.component';
import { injectMutation } from '@tanstack/angular-query-experimental';

@Component({
    selector: 'app-transfer',
    templateUrl: 'transfer.component.html',
    imports: [
        FormsModule,
        NbSpinnerModule,
        ExpenseInputComponent,
        CalendarListItemComponent,
        ConfirmedListItemComponent,
        CategoryListItemComponent,
        DateListItemComponent,
        DescriptionListItemComponent,
        UserListItemComponent,
        FooterComponent,
    ],
})
export class TransferComponent extends AbstractExpenseComponent {
    @ViewChild('expenseInput')
    private expenseInput: ExpenseInputComponent;

    public destinationCalendar: Calendar;

    private readonly expenseQueries = inject(ExpenseQueries);
    private readonly dialogRef = inject<NbDialogRef<ExpenseDialogComponent>>(NbDialogRef);
    private readonly saveMutation = injectMutation(() => this.expenseQueries.save());

    public get isBusy(): boolean {
        return this.saveMutation.isPending();
    }

    public onSubmit(): void {
        const transferExpense = plainToInstance(Expense, instanceToPlain(this.expense));

        transferExpense.calendar = this.destinationCalendar;
        transferExpense.amount = -1 * transferExpense.amount;

        void this.saveMutation
            .mutateAsync(this.expense)
            .then(() => this.saveMutation.mutateAsync(transferExpense))
            .then(() => this.dialogRef.close(true))
            .catch(() => undefined);
    }

    // noinspection JSUnusedGlobalSymbols
    public onTabChange(): void {
        this.expenseInput.stealFocus();
    }
}
