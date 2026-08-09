import { Component, inject, Input } from '@angular/core';
import { Expense } from '../../../../../api/objects/expense';
import { UNCATEGORIZED_COLOR } from '../../../../../util/color.util';
import { expenseMatchesSearch } from '../../../../../util/expense-search.util';
import { ShortNumberPipe } from '../../../../../pipes/shortnumber.pipe';
import { NbIconModule } from '@nebular/theme';
import { MainService } from '../../../main.service';

@Component({
    templateUrl: 'calendar-grid-row-cell-desktop-expense-item.component.html',
    styleUrls: ['calendar-grid-row-cell-desktop-expense-item.component.scss'],
    selector: 'app-calendar-expense-item',
    imports: [ShortNumberPipe, NbIconModule],
    host: {
        '[class.expense-dimmed]': 'isDimmed',
    },
})
export class CalendarGridRowCellDesktopExpenseItemComponent {
    @Input() public expense: Expense;

    protected readonly UNCATEGORIZED_COLOR: string = UNCATEGORIZED_COLOR;

    private readonly mainService = inject(MainService);

    protected get isDimmed(): boolean {
        return !expenseMatchesSearch(this.expense, this.mainService.searchQuery);
    }
}
