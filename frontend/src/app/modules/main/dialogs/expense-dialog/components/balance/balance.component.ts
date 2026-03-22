import { Component, Input, ViewChild, inject } from '@angular/core';
import { NbDialogRef, NbSpinnerModule } from '@nebular/theme';
import { BalanceUpdateApiService } from '../../../../../../api/balance-update.api.service';
import { Expense } from '../../../../../../api/objects/expense';
import { ExpenseDialogResult } from '../../expense-dialog-result';
import { AbstractExpenseComponent } from '../abstract-expense.component';
import { ExpenseInputComponent } from '../expense-input.component';
import { FormsModule } from '@angular/forms';
import { CalendarListItemComponent } from '../fields/calendar-list-item.component';
import { CategoryListItemComponent } from '../fields/category-list-item.component';
import { DateListItemComponent } from '../fields/date-list-item.component';
import { DescriptionListItemComponent } from '../fields/description-list-item.component';
import { UserListItemComponent } from '../fields/user-list-item.component';
import { FooterComponent } from '../fields/footer.component';

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
    private balanceApiService = inject(BalanceUpdateApiService);
    private dialogRef = inject<NbDialogRef<ExpenseDialogResult>>(NbDialogRef);

    @ViewChild('expenseInput')
    private expenseInput: ExpenseInputComponent;

    @Input()
    public deletable: boolean = true;

    public constructor() {
        super();

        this.balanceApiService.onBusyChange.subscribe((isBusy: boolean) => (this.isBusy = isBusy));
    }

    public onSubmit(): void {
        this.balanceApiService
            .save(this.expense)
            .subscribe((expense: Expense) => this.dialogRef.close({ expense }));
    }

    public onDelete(): void {
        this.balanceApiService.delete(this.expense.id).subscribe(() => this.dialogRef.close({ deleted: true }));
    }

    // noinspection JSUnusedGlobalSymbols
    public onTabChange(): void {
        this.expenseInput.stealFocus();
    }
}
