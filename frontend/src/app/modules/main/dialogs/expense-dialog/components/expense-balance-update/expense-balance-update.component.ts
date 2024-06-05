import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { AbstractExpenseComponent } from '../abstract-expense.component';

@Component({
    selector: 'app-expense-balance-update',
    templateUrl: './expense-balance-update.component.html',
})
export class ExpenseBalanceUpdateComponent extends AbstractExpenseComponent implements OnInit, OnDestroy {
    constructor(protected dialogService: NbDialogService) {
        super();
    }

    public ngOnInit(): void {
        console.log('balance update init');
    }

    public ngOnDestroy(): void {
        console.log('abalnce update destroy');
    }
}
