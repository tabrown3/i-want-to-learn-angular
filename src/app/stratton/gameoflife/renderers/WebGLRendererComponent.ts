/* tslint:disable:no-bitwise */

import { Component, ElementRef, ViewChild, AfterViewInit, Inject } from '@angular/core';

import { mat4 } from 'gl-matrix';

import { InjectToken } from '../../stratton.injection';

@Component({
    selector: 'app-gameoflife-webglrenderer',
    template: `
    <canvas #canvas width="640" height="480"></canvas>
    <span *ngIf="message">{{message}}</span>
    `
})
export class WebGlRendererComponent implements AfterViewInit, Stratton.IGameOfLifeRenderer {

    static vertexShaderSource = `
        attribute vec4 aVertexPosition;

        uniform mat4 uModelViewMatrix;
        uniform mat4 uProjectionMatrix;

        void main() {
            gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        }
    `;

    static fragmentShaderSource = `
        void main() {
            gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
        }
    `;

    gl:  WebGLRenderingContext;
    message: string;

    initialize = false;
    program: WebGLProgram;
    vertexPosition: any;
    projectionMatrix: WebGLUniformLocation;
    modelViewMatrix: WebGLUniformLocation;

    buffers: any;

    @ViewChild('canvas') canvasElement: ElementRef;

    constructor(@Inject(InjectToken.IGlobalReference) private globalReference: Stratton.IGlobalReference) {   }

    ngAfterViewInit(): void {
        this.gl = this.canvasElement.nativeElement.getContext('webgl');
        if (!this.gl) {
            this.message = 'WebGl is not supported in your browser';
        }
        if (!this.initialize) {
            this.initialize = true;
            this.initShaderProgram();
            this.initBuffers();

            this.vertexPosition = this.gl.getAttribLocation(this.program, 'aVertexPosition');
            this.projectionMatrix = this.gl.getUniformLocation(this.program, 'uProjectionMatrix');
            this.modelViewMatrix = this.gl.getUniformLocation(this.program, 'uModelViewMatrix');
        }
    }

/* the following code was lovingly lifted from scraped
and repurposed into angular from https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/ */

    render(state: Int8Array, constraints: Stratton.IGameOfLifeConstraints) {
        if (!this.initialize) {
            return;
        }

        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
        this.gl.clearDepth(1.0);                 // Clear everything
        this.gl.enable(this.gl.DEPTH_TEST);           // Enable depth testing
        this.gl.depthFunc(this.gl.LEQUAL);            // Near things obscure far things

        // Clear the canvas before we start drawing on it.

        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // Create a perspective matrix, a special matrix that is
        // used to simulate the distortion of perspective in a camera.
        // Our field of view is 45 degrees, with a width/height
        // ratio that matches the display size of the canvas
        // and we only want to see objects between 0.1 units
        // and 100 units away from the camera.

        const fieldOfView = 45 * Math.PI / 180;   // in radians
        const aspect = this.gl.canvas.clientWidth / this.gl.canvas.clientHeight;
        const zNear = 0.1;
        const zFar = 100.0;
        const projectionMatrix = mat4.create();

        // note: glmatrix.js always has the first argument
        // as the destination to receive the result.
        mat4.perspective(projectionMatrix,
                        fieldOfView,
                        aspect,
                        zNear,
                        zFar);

        // Set the drawing position to the "identity" point, which is
        // the center of the scene.
        const modelViewMatrix = mat4.create();

        // Now move the drawing position a bit to where we want to
        // start drawing the square.

        mat4.translate(modelViewMatrix,     // destination matrix
                        modelViewMatrix,     // matrix to translate
                        [-0.0, 0.0, -6.0]);  // amount to translate

        // Tell WebGL how to pull out the positions from the position
        // buffer into the vertexPosition attribute.
        {
            const numComponents = 2;  // pull out 2 values per iteration
            const type = this.gl.FLOAT;    // the data in the buffer is 32bit floats
            const normalize = false;  // don't normalize
            const stride = 0;         // how many bytes to get from one set of values to the next
                                    // 0 = use type and numComponents above
            const offset = 0;         // how many bytes inside the buffer to start from
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.position);
            this.gl.vertexAttribPointer(
                this.vertexPosition,
                numComponents,
                type,
                normalize,
                stride,
                offset);
                this.gl.enableVertexAttribArray(this.vertexPosition);
        }

        // Tell WebGL to use our program when drawing

        this.gl.useProgram(this.program);

        // Set the shader uniforms

        this.gl.uniformMatrix4fv(
            this.projectionMatrix,
            false,
            projectionMatrix);
        this.gl.uniformMatrix4fv(
            this.modelViewMatrix,
            false,
            modelViewMatrix);

        {
            const offset = 0;
            const vertexCount = 4;
            this.gl.drawArrays(this.gl.TRIANGLE_STRIP, offset, vertexCount);
        }
    }

    private initShaderProgram() {
        const vertexShader = this.loadShader(this.gl.VERTEX_SHADER, WebGlRendererComponent.vertexShaderSource);
        const fragmentShader = this.loadShader(this.gl.FRAGMENT_SHADER, WebGlRendererComponent.fragmentShaderSource);

        this.program = this.gl.createProgram();
        this.gl.attachShader(this.program, vertexShader);
        this.gl.attachShader(this.program, fragmentShader);
        this.gl.linkProgram(this.program);

        if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
            this.message = 'Parameter issue';
            this.program = null;
        }
    }

    private loadShader(type, source): WebGLShader {
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            this.gl.deleteShader(shader);
            this.message = 'shader issue';
            return null;
        }
        return shader;
    }

    private initBuffers() {
        const posBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, posBuffer);

        // points on square
        const points = [
            1.0, 1.0,
            -1.0, 1.0,
            1.0, -1.0,
            -1.0, -1.0
        ];

        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(points), this.gl.STATIC_DRAW);

        this.buffers = {
            position: posBuffer
        };
    }
}
/* tslint:enable:no-bitwise */

