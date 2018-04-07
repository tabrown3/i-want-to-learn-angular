
/* tslint:disable:directive-selector */

import { Directive, Input, OnInit } from '@angular/core';
import { mat4 } from 'gl-matrix';

@Directive({
    selector: 'webgl-camera'
})
export class WebGlCameraDirective implements OnInit {

    @Input() fieldOfView: number;
    @Input() aspect: number;
    @Input() zNear: number;
    @Input() zFar: number;

    readonly projectionMatrix = mat4.create();
    readonly modelViewMatrix = mat4.create();

    ngOnInit(): void {
        mat4.perspective(this.projectionMatrix,
            this.fieldOfView,
            this.aspect,
            this.zNear,
            this.zFar);
    }
}
