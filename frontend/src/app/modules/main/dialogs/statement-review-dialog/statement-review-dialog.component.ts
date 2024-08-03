import { Component } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { Expense } from '../../../../api/objects/expense';

@Component({
    templateUrl: 'statement-review-dialog.component.html',
})
export class StatementReviewDialogComponent {
    public expenses: Expense[] = [];

    public constructor(public readonly dialogRef: NbDialogRef<StatementReviewDialogComponent>) {}

    public onExpenseClick(expense: Expense): void {
        console.log(expense);
    }
}
