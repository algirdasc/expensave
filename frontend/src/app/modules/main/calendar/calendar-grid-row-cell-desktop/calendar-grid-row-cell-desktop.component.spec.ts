import { TestBed } from '@angular/core/testing';
import { NbDateService, NbDialogService } from '@nebular/theme';
import { ResizedEvent } from 'angular-resize-event';
import { Expense } from '../../../../api/objects/expense';
import { CalendarService } from '../calendar.service';
import { CalendarGridRowCellDesktopComponent } from './calendar-grid-row-cell-desktop.component';

describe('CalendarGridRowCellDesktopComponent', () => {
    let component: CalendarGridRowCellDesktopComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: CalendarService, useValue: {} },
                { provide: NbDateService, useValue: {} },
                { provide: NbDialogService, useValue: {} },
            ],
        });

        component = TestBed.runInInjectionContext(() => new CalendarGridRowCellDesktopComponent());
        component.expenses = [expenseWithId(1), expenseWithId(2), expenseWithId(3)];
    });

    it('keeps at least one visible expense when the first resize measurement is too small', (): void => {
        component.onResized(resizedEventWithHeight(0));

        expect(component.visibleExpenses).toEqual([component.expenses[0]]);
        expect(component.invisibleExpensesCount).toBe(2);
    });

    it('uses available height to show more expenses', (): void => {
        component.onResized(resizedEventWithHeight(70));

        expect(component.visibleExpenses).toEqual([component.expenses[0], component.expenses[1]]);
        expect(component.invisibleExpensesCount).toBe(1);
    });
});

const expenseWithId = (id: number): Expense => {
    const expense = new Expense();
    expense.id = id;

    return expense;
};

const resizedEventWithHeight = (height: number): ResizedEvent =>
    ({
        newRect: { height },
    }) as ResizedEvent;
