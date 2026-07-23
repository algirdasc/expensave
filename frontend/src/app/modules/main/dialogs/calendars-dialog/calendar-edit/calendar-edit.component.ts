import { Component, ElementRef, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Calendar } from '../../../../../api/objects/calendar';
import { User } from '../../../../../api/objects/user';
import { FormsModule } from '@angular/forms';
import {
    NbAutocompleteModule,
    NbButtonModule,
    NbCardModule,
    NbFormFieldModule,
    NbIconModule,
    NbInputModule,
    NbListModule,
    NbOptionModule,
    NbTooltipModule,
    NbUserModule,
} from '@nebular/theme';
import { UserQueries } from '../../../../../queries/user.queries';
import { injectQuery } from '@tanstack/angular-query-experimental';

@Component({
    templateUrl: 'calendar-edit.component.html',
    selector: 'app-calendar-edit',
    imports: [
        FormsModule,
        NbCardModule,
        NbButtonModule,
        NbIconModule,
        NbFormFieldModule,
        NbInputModule,
        NbUserModule,
        NbListModule,
        NbAutocompleteModule,
        NbOptionModule,
        NbTooltipModule,
    ],
})
export class CalendarEditComponent {
    @Input()
    public isBusy: boolean = false;

    @Input()
    public calendar: Calendar;

    @Output()
    public readonly save: EventEmitter<Calendar> = new EventEmitter<Calendar>();

    @Output()
    public readonly back: EventEmitter<boolean> = new EventEmitter<boolean>();

    @ViewChild('userAutoCompleteInput')
    private userAutoCompleteInput: ElementRef;

    public filteredOptions: Observable<User[]>;

    private readonly userQueries = inject(UserQueries);
    private readonly usersQuery = injectQuery(() => this.userQueries.profiles());

    private get availableUsers(): User[] {
        return this.usersQuery.data() ?? [];
    }

    public onInputChange(): void {
        this.filteredOptions = this.getFilteredOptions(this.userAutoCompleteInput.nativeElement.value);
    }

    public onUserSelect(user: User): void {
        this.calendar.collaborators ??= [];
        this.calendar.collaborators.push(user);
        this.userAutoCompleteInput.nativeElement.value = '';
        this.onInputChange();
    }

    public getFilteredOptions(value: string): Observable<User[]> {
        return of(value).pipe(
            map(filterString => {
                const filterValue = filterString.toLowerCase();
                return this.availableUsers.filter(user => {
                    const containsValue =
                        user.name.toLowerCase().includes(filterValue) || user.email.toLowerCase().includes(filterValue);

                    return (
                        containsValue &&
                        !(this.calendar.collaborators ?? []).some(collaborator => collaborator.id === user.id) &&
                        user.id !== this.calendar.owner?.id
                    );
                });
            })
        );
    }

    public removeUser(user: User): void {
        this.calendar.collaborators.splice(this.calendar.collaborators.indexOf(user), 1);
    }
}
