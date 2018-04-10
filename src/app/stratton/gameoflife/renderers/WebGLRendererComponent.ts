/* tslint:disable:no-bitwise */
import { Component, ElementRef, ViewChild, ViewChildren, Inject, QueryList, Output, EventEmitter } from '@angular/core';
import { mat4, vec3 } from 'gl-matrix';
import { InjectToken } from '../gameOfLife.injection';
import { GlslShaderDirective } from './GlslShaderDirective';
import { WebGlCameraDirective } from './WebGlCameraDirective';
import { Observable } from 'rxjs/Observable';
import { zip } from 'rxjs/observable/zip';
import { WebGlCanvasDirective } from './WebGlCanvasDirective';
import { WebGlObjectDirective } from './WebGlObjectDirective';
import { MathDirective } from '../mathDirective';
import { map } from 'rxjs/operators';
import { fromEvent } from 'rxjs/observable/fromEvent';

@Component({
    selector: 'app-gameoflife-webglrenderer',
    templateUrl: './WebGlRendererTemplate.html'
})
export class WebGlRendererComponent implements Stratton.GameOfLife.IRenderer {
    isInitialized = false;
    program: WebGLProgram;
    uniformLocations: Stratton.GameOfLife.IWebGlUniformLocations;
    attributes: Stratton.GameOfLife.IWebGlAttributes;

    @ViewChildren(GlslShaderDirective) shaders: QueryList<GlslShaderDirective>;
    @ViewChild(WebGlCameraDirective) camera: WebGlCameraDirective;
    @ViewChildren(WebGlObjectDirective) objects: QueryList<WebGlObjectDirective>;
    @ViewChild(WebGlCanvasDirective) canvas: WebGlCanvasDirective;

    cube: Stratton.GameOfLife.IWebGlObject;

    constructor(@Inject(InjectToken.IGlobalReference) private globalReference: Stratton.IGlobalReference) {   }

    get gl(): WebGLRenderingContext {
        return this.canvas.context;
    }

    initialize(constraints: Stratton.GameOfLife.IConstraints) {

        this.setUpEvents();

        if (this.program) {
            const shaders = this.gl.getAttachedShaders(this.program);
            for (let i = 0; shaders && i < shaders.length; i++) {
                this.gl.deleteShader(shaders[i]);
            }
            this.gl.deleteProgram(this.program);
        }

        zip(...this.shaders.toArray())
        .subscribe((shaderSources) => {

            this.program = this.gl.createProgram();
            shaderSources
                .map(x => this.loadShader(x.shaderType === 'vertex' ? this.gl.VERTEX_SHADER : this.gl.FRAGMENT_SHADER, x.source))
                .forEach(x => this.gl.attachShader(this.program, x));

            this.gl.linkProgram(this.program);
            this.initAttributes();

            zip(...this.objects.toArray())
            .subscribe((webGlObjects) => {
                this.cube = webGlObjects.find(x => x.name === 'cube');
                this.isInitialized = true;
            });
        });
    }

    private setUpEvents() {
        let mouseMoveUnsubscribe: any;

        fromEvent(this.globalReference.document, 'keydown')
        .subscribe((event: KeyboardEvent) => {
            switch (event.key) {
                case 'w':
                case 's':
                    vec3.add(this.camera.position, this.camera.position, [
                        (event.key === 'w' ? -1 : 1) * this.camera.rotation[8],
                        (event.key === 'w' ? -1 : 1) * this.camera.rotation[9],
                        (event.key === 'w' ? -1 : 1) * this.camera.rotation[10]
                    ]);
                    break;
                case 'a':
                case 'd':
                    vec3.add(this.camera.position, this.camera.position, [
                        (event.key === 'a' ? -1 : 1) * this.camera.rotation[0],
                        (event.key === 'a' ? -1 : 1) * this.camera.rotation[1],
                        (event.key === 'a' ? -1 : 1) * this.camera.rotation[2]
                    ]);
                break;
                case 'Shift':
                case 'Control':
                    vec3.add(this.camera.position, this.camera.position, [
                        (event.key === 'Control' ? -1 : 1) * this.camera.rotation[4],
                        (event.key === 'Control' ? -1 : 1) * this.camera.rotation[5],
                        (event.key === 'Control' ? -1 : 1) * this.camera.rotation[6]
                    ]);
                break;
                default: break;
            }
        });


        fromEvent(this.canvas.context.canvas, 'click')
        .subscribe((event: MouseEvent) => {
            if (!this.globalReference.document.pointerLockElement) {
                this.canvas.context.canvas.requestPointerLock();
            }
        });


        fromEvent(this.globalReference.document, 'pointerlockchange')
        .subscribe(() => {
            if (this.globalReference.document.pointerLockElement === this.canvas.context.canvas) {
                mouseMoveUnsubscribe = fromEvent(this.globalReference.document, 'mousemove')
                .subscribe((event: MouseEvent) => {


                    mat4.rotate(this.camera.rotation, this.camera.rotation,
                        (-event.movementY / this.canvas.context.canvas.height)  * this.camera.fieldOfView,
                        [
                            1, // this.camera.rotation[0],
                            0, // this.camera.rotation[4],
                            0, //  this.camera.rotation[8]
                        ]);

                    mat4.rotate(this.camera.rotation, this.camera.rotation,
                    (-event.movementX / this.canvas.context.canvas.width)  * this.camera.fieldOfView,
                    [
                        0,
                        1,
                        0
                    ]);
                });
            } else {
                mouseMoveUnsubscribe.unsubscribe();
            }
        });
    }

    render(state: Int8Array, constraints: Stratton.GameOfLife.IConstraints) {
        if (!this.isInitialized) {
            return;
        }

        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
        this.gl.clearDepth(1.0);                 // Clear everything
        this.gl.enable(this.gl.DEPTH_TEST);           // Enable depth testing
        this.gl.depthFunc(this.gl.LEQUAL);            // Near things obscure far things

        // Clear the canvas before we start drawing on it.
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);


        const viewMatrix = mat4.clone(this.camera.rotation);
        mat4.translate(viewMatrix, viewMatrix, this.camera.position);
        mat4.invert(viewMatrix, viewMatrix);
        // const viewMatrix = mat4.create();
        // mat4.translate(viewMatrix, viewMatrix, this.camera.position);
        // mat4.multiply(viewMatrix, viewMatrix, this.camera.rotation);
        // mat4.invert(viewMatrix, viewMatrix);

        // no skewing or scaling, so normals are mostly fine
        const normalMatrix = mat4.create();
        // mat4.transpose(normalMatrix, viewMatrix);

        this.gl.useProgram(this.program);
        this.gl.uniformMatrix4fv(
            this.uniformLocations.projectionMatrix,
            false,
            this.camera.projectionMatrix);

        this.gl.uniformMatrix4fv(
            this.uniformLocations.normalMatrix,
            false,
            normalMatrix);

        const currentModelView = mat4.create();
        for (let i = 0; i < state.length; i++) {
            if (state[i]) {
                const x = (i % constraints.cols) - constraints.cols / 2;
                const y = -((i / constraints.cols | 0) - constraints.rows / 2);

                mat4.translate(currentModelView, viewMatrix, [x, y, 0.0]);
                this.gl.uniformMatrix4fv(
                    this.uniformLocations.modelViewMatrix,
                    false,
                    currentModelView);
                this.cube.bind(this.attributes);
                this.cube.draw();
            }
        }
    }

    private loadShader(type, source): WebGLShader {
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            alert('An error occurred compiling the shaders: ' + this.gl.getShaderInfoLog(shader));
            this.gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    private initAttributes() {
        this.attributes = {
            vertexPosition : this.gl.getAttribLocation(this.program, 'aVertexPosition'),
            vertexColor : this.gl.getAttribLocation(this.program, 'aVertexColor'),
            vertexNormal : this.gl.getAttribLocation(this.program, 'aVertexNormal')
        };

        this.uniformLocations = {
            projectionMatrix : this.gl.getUniformLocation(this.program, 'uProjectionMatrix'),
            modelViewMatrix : this.gl.getUniformLocation(this.program, 'uModelViewMatrix'),
            normalMatrix : this.gl.getUniformLocation(this.program, 'uNormalMatrix')
        };
    }
}
/* tslint:enable:no-bitwise */

