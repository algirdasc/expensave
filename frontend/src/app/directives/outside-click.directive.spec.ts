import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OutsideClickDirective } from './outside-click.directive';

@Component({
    template: `
        <div appOutsideClick (outsideClick)="onOutsideClick($event)">
            <button id="inside-target" type="button">Inside</button>
        </div>
    `,
    imports: [OutsideClickDirective],
})
class OutsideClickHostComponent {
    public outsideClicks: MouseEvent[] = [];

    public onOutsideClick(event: MouseEvent): void {
        this.outsideClicks.push(event);
    }
}

describe('OutsideClickDirective', () => {
    let fixture: ComponentFixture<OutsideClickHostComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [OutsideClickHostComponent],
        });

        fixture = TestBed.createComponent(OutsideClickHostComponent);
        fixture.detectChanges();
    });

    afterEach(() => {
        document.querySelectorAll('.cdk-overlay-container, #outside-target').forEach(element => element.remove());
    });

    it('does not emit when clicking inside the host element', (): void => {
        dispatchMouseDown(document.getElementById('inside-target'));

        expect(fixture.componentInstance.outsideClicks).toEqual([]);
    });

    it('emits when clicking outside the host element', (): void => {
        const outsideTarget = document.createElement('button');
        outsideTarget.id = 'outside-target';
        document.body.appendChild(outsideTarget);

        dispatchMouseDown(outsideTarget);

        expect(fixture.componentInstance.outsideClicks.length).toBe(1);
    });

    it('does not emit when clicking inside a CDK overlay container', (): void => {
        const overlayContainer = document.createElement('div');
        const overlayTarget = document.createElement('button');
        overlayContainer.className = 'cdk-overlay-container';
        overlayContainer.appendChild(overlayTarget);
        document.body.appendChild(overlayContainer);

        dispatchMouseDown(overlayTarget);

        expect(fixture.componentInstance.outsideClicks).toEqual([]);
    });
});

const dispatchMouseDown = (target: HTMLElement | null): void => {
    target?.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
};
