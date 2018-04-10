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

    constructor(private element: ElementRef) {
        const elm = element.nativeElement;
        this.subscriptions = [
            fromEvent(elm, 'drop').subscribe(this.fileDropped),
            fromEvent(elm, 'dragover').subscribe(this.hovering),
            fromEvent(elm, 'dragenter').subscribe(this.entering)
        ];
    }

    fileDropped = (evt: DragEvent) => {
        evt.preventDefault();
        evt.stopPropagation();
        this.element.nativeElement.style.outline = '0px';
        if (!evt.dataTransfer) {
            return;
        }
        if (evt.dataTransfer.items) {
            for (let i = 0; i < evt.dataTransfer.items.length; i++) {
                const item = evt.dataTransfer.items[i];
                if (item.kind !== 'file') {
                    continue;
                }
                const file = item.getAsFile();
                this.fileDrop.emit(file);
                break;
            }
            evt.dataTransfer.items.clear();
            evt.dataTransfer.clearData();
        } else {
            evt.dataTransfer.clearData();
        }
    }

    hovering = (evt: DragEvent) => {
        evt.preventDefault();
        evt.stopPropagation();

        this.element.nativeElement.style.outline = '1px solid red';
    }

    entering = (evt: Event) => {
        evt.preventDefault();
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
}
