import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
    selector: '[appOutsideClick]',
    standalone: false,
})
export class OutsideClickDirective {
    @Output()
    public outsideClick: EventEmitter<MouseEvent> = new EventEmitter();

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

    public constructor(private elementRef: ElementRef) {}
}
