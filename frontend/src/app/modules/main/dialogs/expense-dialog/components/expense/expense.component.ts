import { Component, Input, ViewChild, inject } from '@angular/core';
import { NbDialogRef, NbSpinnerModule } from '@nebular/theme';
import { ExpenseApiService } from '../../../../../../api/expense.api.service';
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
    selector: 'app-expense',
    templateUrl: 'expense.component.html',
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
export class ExpenseComponent extends AbstractExpenseComponent {
    private expenseApiService = inject(ExpenseApiService);
    private dialogRef = inject<NbDialogRef<ExpenseDialogComponent>>(NbDialogRef);

    @ViewChild('expenseInput')
    private expenseInput: ExpenseInputComponent;

    @Input()
    public deletable: boolean = true;

    @Input()
    public onSubmit: () => void;

    @Input()
    public onDelete: () => void;

    public constructor() {
        super();

        this.expenseApiService.onBusyChange.subscribe((isBusy: boolean) => (this.isBusy = isBusy));
    }

    public onDefaultSubmit(): void {
        this.expenseApiService.save(this.expense).subscribe((expense: Expense) => this.dialogRef.close(expense));
    }

    public onDefaultDelete(): void {
        this.expenseApiService.delete(this.expense.id).subscribe(() => this.dialogRef.close(true));
    }

    // noinspection JSUnusedGlobalSymbols
    public onTabChange(): void {
        this.expenseInput.stealFocus();
    }
}
