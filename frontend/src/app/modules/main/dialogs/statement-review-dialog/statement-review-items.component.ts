import { group } from '@angular/animations';
import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Expense } from '../../../../api/objects/expense';
import { APP_CONFIG } from '../../../../app.initializer';

@Component({
    selector: 'app-statement-review-items',
    templateUrl: 'statement-review-items.component.html',
    styleUrl: 'statement-review-items.component.scss',
})
export class StatementReviewItemsComponent implements OnInit {
    @Input({ required: true })
    protected expenses: Expense[];

    @Input({ required: true })
    protected header: string;

    protected totalExpensesAmount: number = 0;

    protected selectedExpenses: number[] = [];
    protected groupedByDates: { [key: string]: Expense[] } = {};

    public ngOnInit(): void {
        const datePipe = new DatePipe(APP_CONFIG.locale);

        this.expenses.forEach((expense: Expense) => {
            this.totalExpensesAmount += expense.amount;

            const createdAt = datePipe.transform(expense.createdAt);
            if (!this.groupedByDates[createdAt]) {
                this.groupedByDates[createdAt] = [];
            }

            this.groupedByDates[createdAt].push(expense);
        });
    }

    public onClick(expense: Expense): void {
        console.log('click', this.groupedByDates);
    }

    public onDoubleClick(expense: Expense): void {
        console.log('double click');
    }

    protected readonly Object = Object;
    protected readonly group = group;
}
