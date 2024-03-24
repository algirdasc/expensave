import {AfterViewInit, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NbMediaBreakpointsService} from '@nebular/theme';
import {ResizedEvent} from 'angular-resize-event';
import {User} from '../../api/entities/user.entity';
import {ExpenseApiService} from '../../api/expense.api.service';
import {MainService} from './main.service';

@Component({
    templateUrl: 'main.component.html',
    styleUrls: ['main.component.scss']
})
export class MainComponent implements OnInit, AfterViewInit {
    public user: User;
    public isBusy: boolean = false;
    public isMobile: boolean = false;

    constructor(
        private readonly activatedRoute: ActivatedRoute,
        private readonly cd: ChangeDetectorRef,
        private readonly expenseApiService: ExpenseApiService,
        private readonly breakpointService: NbMediaBreakpointsService,
        public readonly mainService: MainService,
    ) {
        this.expenseApiService.onBusyChange.subscribe((isBusy: boolean) => this.isBusy = isBusy);
    }

    public ngAfterViewInit(): void {
        // Detect changes again as calendar-list should be reselected active calendar
        this.cd.detectChanges();
    }

    public ngOnInit(): void {
        this.activatedRoute.data.subscribe(({ user }: { user: User }) => {
            this.mainService.user = user;
        });

        this.mainService.selectedValue = new Date();
    }

    public resized(event: ResizedEvent): void {
        this.isMobile = this.breakpointService.getByName('md').width > event.newRect.width
    }
}
