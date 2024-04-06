import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NbTagComponent} from '@nebular/theme';
import {Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
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

    private suggestionSubject: Subject<string> = new Subject<string>();
    public availableUsers: User[] = [];
    public tagInput: string = '';

    public constructor(
        private readonly userApiService: UserApiService,
    ) {
    }

    public ngOnInit(): void {
        this.suggestionSubject
            .pipe(
                distinctUntilChanged(),
                debounceTime(300)
            )
            .subscribe((name: string) => {
                console.log('searching for input', name);
                this.userApiService
                    .search(name)
                    .subscribe((users: User[]) => this.availableUsers = users)
            });
    }

    public onTagRemove(tag: NbTagComponent): void {
        this.calendar.users = this.calendar.users.filter((u: User) => u.name !== tag.text);
    }

    public onUserInput(name: string): void {
        if (name) {
            this.suggestionSubject.next(name);
        }
    }

    public onUserSelect(user: User): void {
        console.log(user, this.tagInput);
        if (user) {
            this.calendar.users.push(user);
            this.tagInput = '';
        }

        console.log(user, this.tagInput);
    }
}
