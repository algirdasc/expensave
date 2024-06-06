import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { Calendar } from '../../../../../../api/objects/calendar';
import { Expense } from '../../../../../../api/objects/expense';
import { TransferApiService } from '../../../../../../api/transfer.api.service';
import { ExpenseDialogComponent } from '../../expense-dialog.component';
import { AbstractExpenseComponent } from '../abstract-expense.component';

@Component({
    selector: 'app-transfer',
    templateUrl: 'transfer.component.html',
})
export class TransferComponent extends AbstractExpenseComponent implements OnInit {
    public destinationCalendar: Calendar;

    public constructor(
        private transferApiService: TransferApiService,
        private dialogRef: NbDialogRef<ExpenseDialogComponent>
    ) {
        super();
    }

    public ngOnInit(): void {
        this.destinationCalendar = this.expense.calendar;
    }

    public onSubmit(): void {
        this.transferApiService.save(this.expense).subscribe((response: Expense) => this.dialogRef.close(response));
    }
}
