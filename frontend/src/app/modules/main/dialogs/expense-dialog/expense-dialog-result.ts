import { Expense } from '../../../../api/objects/expense';

export interface ExpenseDialogResult {
    expense?: Expense;
    deleted?: boolean;
}
