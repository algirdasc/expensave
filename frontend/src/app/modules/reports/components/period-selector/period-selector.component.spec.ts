import { TestBed } from '@angular/core/testing';
import { NbDateService } from '@nebular/theme';
import { APP_CONFIG } from '../../../../app.initializer';
import { PeriodEnum, PeriodSelectorComponent } from './period-selector.component';

describe('PeriodSelectorComponent', () => {
    let component: PeriodSelectorComponent;

    beforeEach(() => {
        APP_CONFIG.locale = 'en-US';
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: NbDateService,
                    useValue: {
                        addMonth: (date: Date, months: number): Date =>
                            new Date(date.getFullYear(), date.getMonth() + months, 1),
                        createDate: (year: number, month: number, day: number): Date => new Date(year, month, day),
                    },
                },
            ],
        });

        component = TestBed.runInInjectionContext(() => new PeriodSelectorComponent());
        component.period = PeriodEnum.THIS_YEAR;
    });

    it('emits date range for enabled periods', (): void => {
        const emitSpy = spyOn(component.dateRangeChange, 'emit');

        component.onPeriodChange([PeriodEnum.THIS_YEAR]);

        expect(emitSpy).toHaveBeenCalled();
    });

    it('ignores disabled periods', (): void => {
        component.disabledPeriods = [PeriodEnum.LIFETIME, PeriodEnum.CUSTOM];
        const emitSpy = spyOn(component.dateRangeChange, 'emit');

        component.onPeriodChange([PeriodEnum.LIFETIME]);
        component.onPeriodChange([PeriodEnum.CUSTOM]);

        expect(emitSpy).not.toHaveBeenCalled();
    });
});
