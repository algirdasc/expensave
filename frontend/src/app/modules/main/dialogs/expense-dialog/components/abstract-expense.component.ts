import { Component, Input } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { Expense } from '../../../../../api/objects/expense';
import { DateUtil } from '../../../../../util/date.util';
import { DatepickerDialogComponent } from '../../datepicker-dialog/datepicker-dialog.component';

@Component({ template: '' })
export abstract class AbstractExpenseComponent {
    @Input({ required: true })
    public expense: Expense;

    protected dialogService: NbDialogService;

    protected selectDateTime(): void {
        this.dialogService
            .open(DatepickerDialogComponent, {
                context: {
                    date: this.expense.createdAt,
                },
            })
            .onClose.subscribe((result?: Date) => {
                if (result) {
                    this.expense.createdAt = DateUtil.setTime(result, this.expense.createdAt);
                }
            });
    }
}
