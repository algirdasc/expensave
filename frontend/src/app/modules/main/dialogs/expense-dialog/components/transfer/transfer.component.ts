import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { finalize } from 'rxjs/operators';
import { Calendar } from '../../../../../../api/objects/calendar';
import { TRANSFER } from '../../../../../../api/objects/category';
import { Expense } from '../../../../../../api/objects/expense';
import { ExpenseTransferApiService } from '../../../../../../api/expense-transfer.api.service';
import { TRANSFER_COLOR } from '../../../../../../util/color.util';
import { ExpenseDialogComponent } from '../../expense-dialog.component';
import { AbstractExpenseComponent } from '../abstract-expense.component';

@Component({
    selector: 'app-transfer',
    templateUrl: 'transfer.component.html',
})
export class TransferComponent extends AbstractExpenseComponent implements OnInit {
    public destinationCalendar: Calendar;
    public showDestinationCalendarLoader: boolean = false;

    public constructor(
        private expenseTransferApiService: ExpenseTransferApiService,
        private dialogRef: NbDialogRef<ExpenseDialogComponent>
    ) {
        super();

        this.expenseTransferApiService.onBusyChange.subscribe((isBusy: boolean) => (this.isBusy = isBusy));
    }

    public ngOnInit(): void {
        if (this.expense.id && this.expense.category.type === TRANSFER) {
            this.showDestinationCalendarLoader = true;
            this.expenseTransferApiService
                .related(this.expense)
                .pipe(finalize(() => (this.showDestinationCalendarLoader = false)))
                .subscribe((relatedExpense: Expense) => (this.destinationCalendar = relatedExpense.calendar));
        }
    }

    public onSubmit(): void {
        this.expenseTransferApiService
            .transfer(this.expense, this.destinationCalendar)
            .subscribe((response: Expense) => this.dialogRef.close(response));
    }

    public onDelete(): void {
        this.expenseTransferApiService.delete(this.expense.id).subscribe(() => this.dialogRef.close(true));
    }

    protected readonly TRANSFER_COLOR = TRANSFER_COLOR;
}
