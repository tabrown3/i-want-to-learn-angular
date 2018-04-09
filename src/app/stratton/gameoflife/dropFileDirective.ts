/* tslint:disable:directive-selector */
import { Directive, ElementRef, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { fromEvent } from 'rxjs/observable/fromEvent';

@Directive({
    selector: '[dropFile]'
})
export class DropFileDirective {

    @Output() fileDrop: EventEmitter<File> = new EventEmitter<File>();

    constructor(element: ElementRef) {
        fromEvent(element.nativeElement, 'drop')
        .subscribe((evt: DragEvent) => {
            evt.preventDefault();

            if (evt.dataTransfer.items) {
                for (let i = 0; i < evt.dataTransfer.items.length; i++) {
                    const item = evt.dataTransfer.items[i];
                    if (item.kind !== 'file') {
                        continue;
                    }
                    const file = item.getAsFile();
                    this.fileDrop.emit(file);
                }
                evt.dataTransfer.items.clear();
            } else {
                evt.dataTransfer.clearData();
            }
        });

        fromEvent(element.nativeElement, 'dragover')
        .subscribe((evt: Event) => {
            evt.preventDefault();
        });
    }

}
