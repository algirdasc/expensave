import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';
import {Calendar} from '../../../../../api/objects/calendar';
import {User} from '../../../../../api/objects/user';
import {UserApiService} from '../../../../../api/user.api.service';

@Component({
    templateUrl: 'calendar-edit.component.html',
    styleUrl: 'calendar-edit.component.scss',
    selector: 'app-calendar-edit',
})
export class CalendarEditComponent implements OnInit {
    @Input() public isBusy: boolean = false;
    @Input() public calendar: Calendar;
    @Output() public save: EventEmitter<Calendar> = new EventEmitter<Calendar>();
    @Output() public back: EventEmitter<boolean> = new EventEmitter<boolean>();
    @ViewChild('userAutoCompleteInput') userAutoCompleteInput: ElementRef;

    public filteredOptions: Observable<User[]>;
    private availableUsers: User[] = [];

    public constructor(
        private readonly userApiService: UserApiService,
    ) {
    }

    public ngOnInit(): void {
        this.userApiService
            .list()
            .subscribe((users: User[]) => this.availableUsers = users);
    }

    public onInputChange(): void {
        this.filteredOptions = this.getFilteredOptions(this.userAutoCompleteInput.nativeElement.value);
    }

    public getFilteredOptions(value: string): Observable<User[]> {
        return of(value).pipe(
            map(filterString => {
                const filterValue = filterString.toLowerCase();
                return this.availableUsers.filter(optionValue => optionValue.name.toLowerCase().includes(filterValue) || optionValue.email.toLowerCase().includes(filterValue));
            }),
        );
    }

    public onUserSelect(user: User): void {
        this.calendar.collaborators.push(user);
        this.userAutoCompleteInput.nativeElement.value = '';
        this.onInputChange();
    }
}
