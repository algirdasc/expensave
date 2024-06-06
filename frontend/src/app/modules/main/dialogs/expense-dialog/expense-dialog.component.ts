import { Component } from '@angular/core';
import { NbTabComponent } from '@nebular/theme';
import { BALANCE_UPDATE, TRANSFER, UNCATEGORIZED } from '../../../../api/objects/category';
import { Expense } from '../../../../api/objects/expense';

@Component({
    templateUrl: 'expense-dialog.component.html',
    styleUrls: ['expense-dialog.component.scss'],
})
export class ExpenseDialogComponent {
    public expense: Expense;
    public colorize: boolean = true;

    public showTab(categoryType: string): boolean {
        if (!this.expense.id) {
            return true;
        }

        if (this.expense.category.type === categoryType) {
            return true;
        }

        return (
            categoryType === this.USER &&
            (this.expense.category.definedByUser || this.expense.category.type === UNCATEGORIZED)
        );
    }

    public onTabChange(tab: NbTabComponent): void {
        this.colorize = tab.tabId === this.USER;
    }

    protected readonly BALANCE_UPDATE = BALANCE_UPDATE;
    protected readonly TRANSFER = TRANSFER;
    protected readonly USER = 'user';
}
