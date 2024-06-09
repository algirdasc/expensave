import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { appendPropertyInAstObject } from '@schematics/angular/utility/json-utils';
import { Calendar } from '../../../../../../api/objects/calendar';
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

    public constructor(
        private expenseTransferApiService: ExpenseTransferApiService,
        private dialogRef: NbDialogRef<ExpenseDialogComponent>
    ) {
        super();

        this.expenseTransferApiService.onBusyChange.subscribe((isBusy: boolean) => (this.isBusy = isBusy));
    }

    public ngOnInit(): void {
        this.destinationCalendar = this.expense.calendar;
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
