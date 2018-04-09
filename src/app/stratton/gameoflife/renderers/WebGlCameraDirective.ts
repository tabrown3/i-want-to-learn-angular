
/* tslint:disable:directive-selector */

import { Directive, Input, OnInit } from '@angular/core';
import { mat4, vec3 } from 'gl-matrix';

@Directive({
    selector: 'webgl-camera'
})
export class WebGlCameraDirective implements OnInit {

    @Input() fieldOfView: number;
    @Input() aspect: number;
    @Input() zNear: number;
    @Input() zFar: number;
    @Input() initPosition: number[];
    @Input() initRotation: number[];

    readonly projectionMatrix = mat4.create();

    readonly rotation = mat4.create();
    readonly position = vec3.create();

    ngOnInit(): void {
        mat4.perspective(this.projectionMatrix,
            this.fieldOfView,
            this.aspect,
            this.zNear,
            this.zFar);        
        mat4.set(this.rotation, ...this.initRotation);
        vec3.set(this.position, ...this.initPosition);
    }
}
