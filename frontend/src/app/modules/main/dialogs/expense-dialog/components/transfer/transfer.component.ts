import { Component, ViewChild, inject } from '@angular/core';
import { NbDialogRef, NbSpinnerModule } from '@nebular/theme';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { ExpenseApiService } from '../../../../../../api/expense.api.service';
import { Calendar } from '../../../../../../api/objects/calendar';
import { Expense } from '../../../../../../api/objects/expense';
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
    private expenseApiService = inject(ExpenseApiService);
    private dialogRef = inject<NbDialogRef<ExpenseDialogComponent>>(NbDialogRef);

    public destinationCalendar: Calendar;

    @ViewChild('expenseInput')
    private expenseInput: ExpenseInputComponent;

    public constructor() {
        super();

        this.expenseApiService.onBusyChange.subscribe((isBusy: boolean) => (this.isBusy = isBusy));
    }

    public onSubmit(): void {
        const transferExpense = plainToInstance(Expense, instanceToPlain(this.expense));

        transferExpense.calendar = this.destinationCalendar;
        transferExpense.amount = -1 * transferExpense.amount;

        this.expenseApiService.save(this.expense).subscribe(() => {
            this.expenseApiService.save(transferExpense).subscribe(() => {
                this.dialogRef.close(true);
            });
        });
    }

    // noinspection JSUnusedGlobalSymbols
    public onTabChange(): void {
        this.expenseInput.stealFocus();
    }
}
