import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NbCardModule, NbTabComponent, NbTabsetModule } from '@nebular/theme';
import { instanceToInstance } from 'class-transformer';
import { Category, TYPE_BALANCE_UPDATE } from '../../../../api/objects/category';
import { Expense } from '../../../../api/objects/expense';
import { BalanceComponent } from './components/balance/balance.component';
import { ExpenseComponent } from './components/expense/expense.component';
import { TransferComponent } from './components/transfer/transfer.component';

@Component({
    templateUrl: 'expense-dialog.component.html',
    styleUrls: ['expense-dialog.component.scss'],
    imports: [NbCardModule, NbTabsetModule, ExpenseComponent, TransferComponent, BalanceComponent],
})
export class ExpenseDialogComponent implements OnInit {
    @ViewChild('tabExpense')
    public tabExpense: ElementRef<ExpenseComponent>;

    @ViewChild('tabTransfer')
    public tabTransfer: ElementRef<TransferComponent>;

    @ViewChild('tabBalance')
    public tabBalance: ElementRef<BalanceComponent>;

    public expense: Expense;
    public transfer: Expense;
    public balance: Expense;

    public showTransferTab: boolean = false;
    public showBalanceTab: boolean = false;
    public deletable: boolean = false;

    public onExpenseSubmit: () => void;
    public onExpenseDelete: () => void;
    public onBalanceSubmit: () => void;
    public onBalanceDelete: () => void;

    public predefinedCategories: { [key: string]: Category } = {};

    protected readonly TAB_ID_EXPENSE = 'expense';
    protected readonly TAB_ID_TRANSFER = 'transfer';
    protected readonly TAB_ID_BALANCE = 'balance';
    protected readonly TYPE_BALANCE_UPDATE = TYPE_BALANCE_UPDATE;
    protected isCurrentTabConfirmed: boolean = false;

    private currentTab: string;

    public ngOnInit(): void {
        if (this.showTransferTab) {
            this.transfer = instanceToInstance(this.expense);
        }

        if (this.showBalanceTab) {
            this.balance = instanceToInstance(this.expense);
            this.balance.category = this.predefinedCategories[TYPE_BALANCE_UPDATE];
        }

        this.currentTab =
            !this.expense.id || this.expense.category.type !== TYPE_BALANCE_UPDATE
                ? this.TAB_ID_EXPENSE
                : this.showTransferTab
                  ? this.TAB_ID_TRANSFER
                  : this.TAB_ID_BALANCE;
        this.updateCurrentTabConfirmed();
    }

    public onTabChange(tab: NbTabComponent): void {
        const tabRefName = 'tab' + tab.tabTitle;
        if (this[tabRefName]['onTabChange']) {
            this[tabRefName]['onTabChange'](tab);
        }
        this.currentTab = tab.tabId;
        this.updateCurrentTabConfirmed();
    }

    private updateCurrentTabConfirmed(): void {
        switch (this.currentTab) {
            case this.TAB_ID_EXPENSE:
                this.isCurrentTabConfirmed = this.expense.confirmed;
                break;
            case this.TAB_ID_TRANSFER:
                this.isCurrentTabConfirmed = this.transfer.confirmed;
                break;
            case this.TAB_ID_BALANCE:
                this.isCurrentTabConfirmed = this.balance.confirmed;
                break;
            default:
                this.isCurrentTabConfirmed = false;
        }
    }
}
