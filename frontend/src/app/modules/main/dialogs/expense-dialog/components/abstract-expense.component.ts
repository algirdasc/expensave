import { Component, Input } from '@angular/core';
import { Expense } from '../../../../../api/objects/expense';

@Component({ template: '' })
export abstract class AbstractExpenseComponent {
    @Input({ required: true })
    public expense: Expense;
}
