import { SimpleChange } from '@angular/core';
import { fakeAsync, tick } from '@angular/core/testing';
import { SuggestionComponent } from './suggestion.component';

describe('SuggestionComponent', () => {
    let component: SuggestionComponent;

    beforeEach(() => {
        component = new SuggestionComponent();
    });

    it('exposes only the remaining suggestion text when the input matches case-insensitively', (): void => {
        component.input = 'cof';
        component.suggestion = 'Coffee';

        expect(component.suggestion).toBe('fee');
    });

    it('hides the suggestion when the input does not match the suggestion prefix', (): void => {
        component.input = 'tea';
        component.suggestion = 'Coffee';

        expect(component.suggestion).toBe('');
    });

    it('emits the combined suggestion when applied', (): void => {
        const emitted: string[] = [];
        component.input = 'cof';
        component.suggestion = 'Coffee';
        component.suggest.subscribe((value: string) => emitted.push(value));

        component.applySuggestion();

        expect(emitted).toEqual(['coffee']);
    });

    it('applies the suggestion when the full suggestion matches the current input', (): void => {
        const emitted: string[] = [];
        component.input = 'Coffee';
        component.suggestion = 'Coffee';
        component.suggest.subscribe((value: string) => emitted.push(value));

        component.ngOnChanges({
            suggestion: new SimpleChange(null, 'Coffee', false),
        });

        expect(emitted).toEqual(['Coffee']);
    });

    it('debounces input changes after initialization', fakeAsync((): void => {
        const emitted: string[] = [];
        component.inputChanged.subscribe((value: string) => emitted.push(value));
        component.ngOnInit();

        component.ngOnChanges({
            input: new SimpleChange('co', 'cof', false),
        });
        component.ngOnChanges({
            input: new SimpleChange('cof', 'coff', false),
        });
        tick(299);

        expect(emitted).toEqual([]);

        tick(1);

        expect(emitted).toEqual(['coff']);
    }));
});
