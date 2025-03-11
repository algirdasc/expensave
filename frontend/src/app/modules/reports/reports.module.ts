import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
    NbActionsModule,
    NbButtonGroupModule,
    NbButtonModule,
    NbCalendarKitModule,
    NbCardModule,
    NbCheckboxModule,
    NbDatepickerModule,
    NbIconModule,
    NbLayoutModule,
    NbListModule,
    NbPopoverModule,
    NbSidebarModule,
    NbSpinnerModule,
} from '@nebular/theme';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';

import { CategoryExpensesComponent } from './components/category-expenses/category-expenses.component';
import { DailyExpensesComponent } from './components/daily-expenses/daily-expenses.component';
import { DateRangeComponent } from './components/date-range.component';
import { MonthlyExpensesComponent } from './components/monthly-expenses/monthly-expenses.component';
import { PeriodSelectorComponent } from './components/period-selector/period-selector.component';
import { ReportsComponent } from './reports.component';
import { reportsRoutes } from './reports.routes';
import { ReportsService } from './reports.service';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(reportsRoutes),
        NbLayoutModule,
        NbCardModule,
        NbDatepickerModule,
        NbButtonGroupModule,
        NbCalendarKitModule,
        NbPopoverModule,
        NbSidebarModule.forRoot(),
        NbButtonModule,
        NbIconModule,
        NbListModule,
        NbCheckboxModule,
        NbSpinnerModule,
        BaseChartDirective,
        NbActionsModule,
        ReportsComponent,
        DateRangeComponent,
        PeriodSelectorComponent,
        DailyExpensesComponent,
        MonthlyExpensesComponent,
        CategoryExpensesComponent,
    ],
    providers: [ReportsService, provideCharts(withDefaultRegisterables())],
})
export class ReportsModule {}
