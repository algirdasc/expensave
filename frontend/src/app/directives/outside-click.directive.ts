import { Directive, ElementRef, EventEmitter, HostListener, inject, Output } from '@angular/core';

@Directive({ selector: '[appOutsideClick]', standalone: true })
export class OutsideClickDirective {
    @Output()
    public readonly outsideClick: EventEmitter<MouseEvent> = new EventEmitter();

    private elementRef = inject(ElementRef);

    @HostListener('document:mousedown', ['$event'])
    public onClick(event: MouseEvent): void {
        const overlays = Array.from(document.getElementsByClassName('cdk-overlay-container'));
        for (const overlay of overlays) {
            if (overlay.contains(event.target as HTMLElement)) {
                return;
            }
        }

        if (!this.elementRef.nativeElement.contains(event.target)) {
            this.outsideClick.emit(event);
        }
    }
}
