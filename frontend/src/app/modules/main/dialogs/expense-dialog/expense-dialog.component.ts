import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NbTabComponent } from '@nebular/theme';
import { instanceToInstance } from 'class-transformer';
import { TYPE_BALANCE_UPDATE, Category, TYPE_UNCATEGORIZED } from '../../../../api/objects/category';
import { Expense } from '../../../../api/objects/expense';
import { BalanceComponent } from './components/balance/balance.component';
import { ExpenseComponent } from './components/expense/expense.component';
import { TransferComponent } from './components/transfer/transfer.component';

@Component({
    templateUrl: 'expense-dialog.component.html',
    styleUrls: ['expense-dialog.component.scss'],
})
export class ExpenseDialogComponent implements OnInit {
    public expense: Expense;
    public transfer: Expense;
    public balance: Expense;

    public categoryMap: { [key: string]: Category };

    @ViewChild('tabExpense')
    public tabExpense: ElementRef<ExpenseComponent>;

    @ViewChild('tabTransfer')
    public tabTransfer: ElementRef<TransferComponent>;

    @ViewChild('tabBalance')
    public tabBalance: ElementRef<BalanceComponent>;

    private currentTab: string;

    public ngOnInit(): void {
        if (!this.expense.id) {
            this.expense.category = this.categoryMap[TYPE_UNCATEGORIZED];
            this.expense.confirmed = true;
        }

        this.transfer = instanceToInstance(this.expense);

        this.balance = instanceToInstance(this.expense);
        this.balance.category = this.categoryMap[TYPE_BALANCE_UPDATE];
    }

    public onTabChange(tab: NbTabComponent): void {
        const tabRefName = 'tab' + tab.tabTitle;
        if (this[tabRefName]['onTabChange']) {
            this[tabRefName]['onTabChange'](tab);
        }
        this.currentTab = tab.tabId;
    }

    public isTabConfirmed(): boolean {
        switch (true) {
            case this.currentTab === this.TAB_ID_EXPENSE:
                return this.expense.confirmed;
            case this.currentTab === this.TAB_ID_TRANSFER:
                return this.transfer.confirmed;
            case this.currentTab === this.TAB_ID_BALANCE:
                return this.balance.confirmed;
        }

        return false;
    }

    protected readonly TAB_ID_EXPENSE = 'expense';
    protected readonly TAB_ID_TRANSFER = 'transfer';
    protected readonly TAB_ID_BALANCE = 'balance';
    protected readonly TYPE_BALANCE_UPDATE = TYPE_BALANCE_UPDATE;
}
