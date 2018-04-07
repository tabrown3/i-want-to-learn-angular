/* tslint:disable:directive-selector */

import { Directive } from '@angular/core';
import { ElementRef } from '@angular/core/src/linker/element_ref';

@Directive({
    selector: 'webgl-canvas'
})
export class WebGlCanvasDirective  {

    context:  WebGLRenderingContext;

    constructor( element : ElementRef) {
        this.context = element.nativeElement.getContext('webgl');
    }
}
