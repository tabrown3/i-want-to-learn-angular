import { Directive, ElementRef } from '@angular/core';

@Directive({
    selector: '[webglCanvas]',
    exportAs: 'webglCanvas'
})
export class WebGlCanvasDirective  {

    context:  WebGLRenderingContext;

    constructor( element : ElementRef) {
        this.context = element.nativeElement.getContext('webgl');
    }
}
