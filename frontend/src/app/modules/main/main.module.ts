import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {NbEvaIconsModule} from '@nebular/eva-icons';
import {
    NbActionsModule,
    NbAutocompleteModule,
    NbButtonGroupModule,
    NbButtonModule,
    NbCalendarKitModule,
    NbCalendarModule,
    NbCardModule,
    NbFormFieldModule,
    NbIconModule,
    NbInputModule,
    NbLayoutModule,
    NbListModule,
    NbPopoverModule,
    NbRadioModule,
    NbSidebarModule,
    NbSpinnerModule,
    NbTagModule,
    NbUserModule
} from '@nebular/theme';
import {AngularResizeEventModule} from 'angular-resize-event';
import {SwipeDirective} from '../../directives/swipe.directive';
import {ShortNumberPipe} from '../../pipes/shortnumber.pipe';
import {CalendarResolver} from '../../resolvers/calendar.resolver';
import {UserResolver} from '../../resolvers/user.resolver';
import {CalendarDayNamesComponent} from './calendar/calendar-day-names/calendar-day-names.component';
import {
    CalendarExpenseListMobileItemsComponent
} from './calendar/calendar-expense-list-mobile/calendar-expense-list-mobile-items.component';
import {
    CalendarExpenseListMobileComponent
} from './calendar/calendar-expense-list-mobile/calendar-expense-list-mobile.component';
import {
    CalendarGridRowCellDesktopExpenseItemComponent
} from './calendar/calendar-grid-row-cell-desktop/calendar-grid-row-cell-desktop-expense-item/calendar-grid-row-cell-desktop-expense-item.component';
import {
    CalendarGridRowCellDesktopComponent
} from './calendar/calendar-grid-row-cell-desktop/calendar-grid-row-cell-desktop.component';
import {
    CalendarGridRowCellMobileComponent
} from './calendar/calendar-grid-row-cell-mobile/calendar-grid-row-cell-mobile.component';
import {CalendarGridRowComponent} from './calendar/calendar-grid-row/calendar-grid-row.component';
import {CalendarGridComponent} from './calendar/calendar-grid/calendar-grid.component';
import {CalendarMonthModelService} from './calendar/calendar-month-model.service';
import {CalendarComponent} from './calendar/calendar.component';
import {CalendarService} from './calendar/calendar.service';
import {SuggestionComponent} from './components/suggestion/suggestion.component';
import {CalendarEditComponent} from './dialogs/calendars-dialog/calendar-edit/calendar-edit.component';
import {CalendarListComponent} from './dialogs/calendars-dialog/calendar-list/calendar-list.component';
import {CalendarsDialogComponent} from './dialogs/calendars-dialog/calendars-dialog.component';
import {CategoriesDialogComponent} from './dialogs/categories-dialog/categories-dialog.component';
import {CategoryEditComponent} from './dialogs/categories-dialog/category-edit/category-edit.component';
import {CategoryListComponent} from './dialogs/categories-dialog/category-list/category-list.component';
import {ConfirmDialogComponent} from './dialogs/confirm-dialog/confirm-dialog.component';
import {DatepickerDialogComponent} from './dialogs/datepicker-dialog/datepicker-dialog.component';
import {ExpenseDialogComponent} from './dialogs/expense-dialog/expense-dialog.component';
import {ExpenseListDialogComponent} from './dialogs/expense-list-dialog/expense-list-dialog.component';
import {InputDialogComponent} from './dialogs/input-dialog/input-dialog.component';
import {ProfileDialogComponent} from './dialogs/profile-dialog/profile-dialog.component';
import {StatementImportDialogComponent} from './dialogs/statement-import-dialog/statement-import-dialog.component';
import {HeaderComponent} from './header/header.component';
import {MainComponent} from './main.component';
import {mainRoutes} from './main.routes';
import {MainService} from './main.service';
import {CalendarSidebarListComponent} from './sidebar/calendar-list/calendar-list.component';
import {ProfileComponent} from './sidebar/profile/profile.component';

@NgModule({
    declarations: [
        // UI Components
        MainComponent,
        HeaderComponent,
        CalendarSidebarListComponent,
        ProfileComponent,
        CalendarComponent,
        SuggestionComponent,

        // CalendarComponent Components
        CalendarDayNamesComponent,
        CalendarGridComponent,
        CalendarGridRowComponent,
        CalendarGridRowCellDesktopComponent,
        CalendarGridRowCellMobileComponent,
        CalendarExpenseListMobileComponent,
        CalendarGridRowCellDesktopExpenseItemComponent,
        CalendarExpenseListMobileItemsComponent,

        // Dialogs
        ConfirmDialogComponent,
        ExpenseDialogComponent,
        ExpenseListDialogComponent,
        ProfileDialogComponent,
        CategoriesDialogComponent,
        CalendarsDialogComponent,
        StatementImportDialogComponent,
        InputDialogComponent,
        DatepickerDialogComponent,

        // Dialog components
        CalendarListComponent,
        CalendarEditComponent,
        CategoryEditComponent,
        CategoryListComponent,

        // Pipes
        ShortNumberPipe,

        // Directives
        SwipeDirective,
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(mainRoutes),
        FormsModule,
        NbLayoutModule,
        NbSidebarModule.forRoot(),
        NbCalendarModule,
        NbRadioModule,
        NbButtonModule,
        NbEvaIconsModule,
        NbIconModule,
        NbActionsModule,
        NbCalendarKitModule,
        NbInputModule,
        NbUserModule,
        NbButtonGroupModule,
        NbListModule,
        NbSpinnerModule,
        NbCardModule,
        NbPopoverModule,
        NbTagModule,
        NbAutocompleteModule,
        NbFormFieldModule,
        AngularResizeEventModule,
    ],
    providers: [
        MainService,
        CalendarService,
        CalendarMonthModelService,

        // Resolvers
        UserResolver,
        CalendarResolver,
    ]
})
export class MainModule { }
