import {AfterViewInit, ChangeDetectorRef, Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NbCalendarViewMode, NbDateService} from '@nebular/theme';
import {Calendar} from '../../api/entities/calendar.entity';
import {User} from '../../api/entities/user.entity';
import {DateRangeChangeEvent} from './calendar/events/date-range-change.event';
import {MainService} from './main.service';
import {ExpenseApiService} from '../../api/expense.api.service';
import {Expense} from '../../api/entities/expense.entity';

@Component({
    templateUrl: 'main.component.html',
    styleUrls: ['main.component.scss']
})
export class MainComponent implements OnInit, AfterViewInit {
    public user: User;
    public isBusy: boolean = false;

    constructor(
        private readonly activatedRoute: ActivatedRoute,
        private readonly cd: ChangeDetectorRef,
        private readonly expenseApiService: ExpenseApiService,
        public readonly mainService: MainService
    ) {
        // dateSelectorService.onDateChange.subscribe((date: Date) => {
        //     this.router.navigate([], { queryParams: { ts: date.getTime() }, queryParamsHandling: 'merge'});
        // });
        this.expenseApiService.onBusyChange.subscribe((isBusy: boolean) => this.isBusy = isBusy);
    }

    public ngAfterViewInit(): void {
        // Detect changes again as calendar-list should be reselected active calendar
        this.cd.detectChanges();
    }

    public ngOnInit(): void {
        // this.dateSelectorService.navigateToday();
        this.activatedRoute.data.subscribe(({ user }: { user: User }) => {
            this.mainService.user = user;
        });

        this.activatedRoute.queryParams.subscribe(({ ts, calendar }) => {
            const date = new Date(parseInt(ts));
            if (date.toString() !== 'Invalid Date') {
                this.mainService.selectedDate = date;
            } else {
                this.mainService.selectedDate = new Date();
            }
        });
    }
}
