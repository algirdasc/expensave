import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';

@Component({
    selector: 'app-input-suggestion',
    templateUrl: 'suggestion.component.html',
    styleUrls: ['suggestion.component.scss']
})
export class SuggestionComponent implements OnInit, OnChanges {
    @Input() public input: string = '';
    @Input() public cssClasses: string = '';
    @Output() public suggestionChange: EventEmitter<string> = new EventEmitter<string>();
    @Output() public inputChanged: EventEmitter<string> = new EventEmitter<string>();
    @Output() public suggest: EventEmitter<string> = new EventEmitter<string>();

    private _suggestion: string = '';
    private suggestionSubject: Subject<string> = new Subject<string>();

    @Input()
    get suggestion(): string {
        if (this.input !== '' && this._suggestion.startsWith(this.input)) {
            return this._suggestion.substring(this.input.length);
        }

        return '';
    }

    set suggestion(value: string|null) {
        if (value === null) {
            return;
        }

        this._suggestion = value;
    }

    public doSuggest(): void {
        if (this._suggestion !== '') {
            this.suggest.emit(this.input + this.suggestion);
        }
    }

    public ngOnInit(): void {
        this.suggestionSubject
            .pipe(
                distinctUntilChanged(),
                debounceTime(750)
            )
            .subscribe((input: string) => {
                this.inputChanged.emit(input);
            });
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.suggestion && changes.suggestion.currentValue === this.input) {
            // TODO: fix ExpressionChangedAfterItHasBeenCheckedError error
            this.doSuggest();
        }

        if (changes.input && !changes.input.isFirstChange()) {
            this.suggestionSubject.next(changes.input.currentValue);
        }
    }
}
