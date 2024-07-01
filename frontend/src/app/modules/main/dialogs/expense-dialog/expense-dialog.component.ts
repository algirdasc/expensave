import { Component } from '@angular/core';
import { NbTabComponent } from '@nebular/theme';
import { TYPE_BALANCE_UPDATE, Category, TYPE_UNCATEGORIZED } from '../../../../api/objects/category';
import { Expense } from '../../../../api/objects/expense';

@Component({
    templateUrl: 'expense-dialog.component.html',
    styleUrls: ['expense-dialog.component.scss'],
})
export class ExpenseDialogComponent {
    public expense: Expense;
    public categoryMap: { [key: string]: Category };

    public onTabChange(tab: NbTabComponent): void {
        if (!this.expense.id) {
            this.expense.category = this.categoryMap[tab.tabId];
            this.expense.confirmed = true;
        }
    }

    protected readonly TYPE_BALANCE_UPDATE = TYPE_BALANCE_UPDATE;
    protected readonly TYPE_UNCATEGORIZED = TYPE_UNCATEGORIZED;
}
