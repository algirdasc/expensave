import { Component, Input } from '@angular/core';
import { Expense } from '../../../../../api/objects/expense';
import { UNCATEGORIZED_COLOR } from '../../../../../util/color.util';
import { ShortNumberPipe } from '../../../../../pipes/shortnumber.pipe';
import { NbIconModule } from '@nebular/theme';

@Component({
    templateUrl: 'calendar-grid-row-cell-desktop-expense-item.component.html',
    styleUrls: ['calendar-grid-row-cell-desktop-expense-item.component.scss'],
    selector: 'app-calendar-expense-item',
    imports: [ShortNumberPipe, NbIconModule],
})
export class CalendarGridRowCellDesktopExpenseItemComponent {
    @Input() public expense: Expense;

    protected readonly UNCATEGORIZED_COLOR: string = UNCATEGORIZED_COLOR;
}
