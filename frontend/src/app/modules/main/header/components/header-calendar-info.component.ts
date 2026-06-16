import { DecimalPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NbPopoverModule } from '@nebular/theme';
import { Calendar } from '../../../../api/objects/calendar';
import { ShortNumberPipe } from '../../../../pipes/shortnumber.pipe';
import { ExpenseReportComponent } from '../../components/expense-report/expense-report.component';

@Component({
    selector: 'app-header-calendar-info',
    template: `
        <div class="mx-3 calendar-info">
            <strong class="d-block">{{ calendar?.name }}</strong>
            <small class="d-block text-hint">
                <span title="Current balance: {{ calendar?.balance | number: '.2-2' }}">{{
                    calendar?.balance | shortNumber
                }}</span>
                @if (visibleDateBalance) {
                    <span>
                        •
                        <a
                            href="#"
                            title="This month balance: {{ visibleDateBalance | number: '.2-2' }}"
                            [nbPopover]="expenseReportComponent"
                            nbPopoverPlacement="bottom"
                            (click)="$event.preventDefault()"
                            [class.balance-positive]="visibleDateBalance > 0"
                            [class.balance-negative]="visibleDateBalance < 0">
                            {{ visibleDateBalance | shortNumber }}
                        </a>
                    </span>
                }
            </small>
        </div>
    `,
    styles: [
        `
            .balance-positive {
                color: var(--text-success-color);
            }

            .balance-negative {
                color: var(--text-danger-color);
            }
        `,
    ],
    imports: [NbPopoverModule, ShortNumberPipe, DecimalPipe],
})
export class HeaderCalendarInfoComponent {
    @Input() public calendar: Calendar;
    @Input() public visibleDateBalance: number;

    protected readonly expenseReportComponent = ExpenseReportComponent;
}
