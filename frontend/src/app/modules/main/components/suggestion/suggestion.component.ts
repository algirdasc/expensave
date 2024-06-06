import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
    selector: 'app-input-suggestion',
    templateUrl: 'suggestion.component.html',
    styleUrls: ['suggestion.component.scss'],
})
export class SuggestionComponent implements OnInit, OnChanges {
    @Input()
    public input: string = '';

    @Input()
    public cssClasses: string = '';

    @Output()
    public suggestionChange: EventEmitter<string> = new EventEmitter<string>();

    @Output()
    public inputChanged: EventEmitter<string> = new EventEmitter<string>();

    @Output()
    public suggest: EventEmitter<string> = new EventEmitter<string>();

    private _suggestion: string = '';
    private suggestionSubject: Subject<string> = new Subject<string>();

    @Input()
    public get suggestion(): string {
        if (this.input && this._suggestion) {
            const suggestionSubstring = this._suggestion.substring(0, this.input.length);
            if (this.input.localeCompare(suggestionSubstring, undefined, { sensitivity: 'base' }) === 0) {
                return this._suggestion.substring(this.input.length);
            }
        }

        return '';
    }

    public set suggestion(value: string | null) {
        this._suggestion = value === null ? '' : value;
    }

    public applySuggestion(): void {
        if (this._suggestion !== '') {
            this.suggest.emit(this.input + this.suggestion);
        }
    }

    public ngOnInit(): void {
        this.suggestionSubject.pipe(distinctUntilChanged(), debounceTime(300)).subscribe((input: string) => {
            this.inputChanged.emit(input);
        });
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.suggestion && changes.suggestion.currentValue === this.input) {
            // TODO: fix ExpressionChangedAfterItHasBeenCheckedError error
            this.applySuggestion();
        }

        if (changes.input && !changes.input.isFirstChange()) {
            this.suggestionSubject.next(changes.input.currentValue);
        }
    }
}
