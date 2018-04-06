
/* tslint:disable:component-selector */

import { Component, Input, OnInit } from '@angular/core';
import { mat4 } from 'gl-matrix';

@Component({
    selector: 'webgl-camera'
})
export class WebGlCameraComponent implements OnInit {

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
