import { Component, inject, Input, ViewChild } from '@angular/core';
import { NbDialogRef, NbSpinnerModule } from '@nebular/theme';
import { Expense } from '../../../../../../api/objects/expense';
import { BalanceUpdateQueries } from '../../../../../../queries/balance-update.queries';
import { ExpenseDialogComponent } from '../../expense-dialog.component';
import { AbstractExpenseComponent } from '../abstract-expense.component';
import { ExpenseInputComponent } from '../expense-input.component';
import { FormsModule } from '@angular/forms';
import { CalendarListItemComponent } from '../fields/calendar-list-item.component';
import { CategoryListItemComponent } from '../fields/category-list-item.component';
import { DateListItemComponent } from '../fields/date-list-item.component';
import { DescriptionListItemComponent } from '../fields/description-list-item.component';
import { UserListItemComponent } from '../fields/user-list-item.component';
import { FooterComponent } from '../fields/footer.component';
import { injectMutation } from '@tanstack/angular-query-experimental';

@Component({
    selector: 'app-balance',
    templateUrl: 'balance.component.html',
    imports: [
        FormsModule,
        NbSpinnerModule,
        ExpenseInputComponent,
        CalendarListItemComponent,
        CategoryListItemComponent,
        DateListItemComponent,
        DescriptionListItemComponent,
        UserListItemComponent,
        FooterComponent,
    ],
})
export class BalanceComponent extends AbstractExpenseComponent {
    @Input()
    public deletable: boolean = true;

    @Input()
    public onSubmit: () => void;

    @Input()
    public onDelete: () => void;

    @ViewChild('expenseInput')
    private expenseInput: ExpenseInputComponent;

    private readonly balanceUpdateQueries = inject(BalanceUpdateQueries);
    private readonly dialogRef = inject<NbDialogRef<ExpenseDialogComponent>>(NbDialogRef);
    private readonly saveMutation = injectMutation(() => this.balanceUpdateQueries.save());
    private readonly deleteMutation = injectMutation(() => this.balanceUpdateQueries.delete());

    public onDefaultSubmit(): void {
        this.isBusy = true;
        this.saveMutation.mutate(this.expense, {
            onSuccess: (expense: Expense) => this.dialogRef.close(expense),
            onSettled: () => (this.isBusy = false),
        });
    }

    public onDefaultDelete(): void {
        this.isBusy = true;
        this.deleteMutation.mutate(this.expense, {
            onSuccess: () => this.dialogRef.close(true),
            onSettled: () => (this.isBusy = false),
        });
    }

    // noinspection JSUnusedGlobalSymbols
    public onTabChange(): void {
        this.expenseInput.stealFocus();
    }
}
