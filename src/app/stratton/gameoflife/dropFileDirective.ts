/* tslint:disable:directive-selector */
import { Directive, ElementRef, EventEmitter, Output, OnDestroy } from '@angular/core';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { Subscription } from 'rxjs/Subscription';

@Directive({
    selector: '[dropFile]'
})
export class DropFileDirective implements OnDestroy {

    @Output() fileDrop: EventEmitter<File> = new EventEmitter<File>();

    subscriptions: Subscription[];

    constructor(element: ElementRef) {
        const elm = element.nativeElement;
        this.subscriptions = [
            fromEvent(elm, 'drop').subscribe(this.fileDropped),
            fromEvent(elm, 'dragover').subscribe(this.cancelEvent)
        ];
    }

    fileDropped = (evt: DragEvent) => {
        this.cancelEvent(evt);

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
    }

    cancelEvent = (evt: DragEvent) => evt.preventDefault();

    ngOnDestroy(): void {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
}
