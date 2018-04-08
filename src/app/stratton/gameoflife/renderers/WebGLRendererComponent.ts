/* tslint:disable:no-bitwise */
import { Component, ElementRef, ViewChild, ViewChildren, Inject, QueryList, Output, EventEmitter } from '@angular/core';
import { mat4, vec3 } from 'gl-matrix';
import { InjectToken } from '../gameOfLife.injection';
import { GlslShaderDirective } from './GlslShaderDirective';
import { WebGlCameraDirective } from './WebGlCameraDirective';
import { Observable } from 'rxjs/Observable';
import { zip } from 'rxjs/observable/zip';
import { WebGlCanvasDirective } from './WebGlCanvasDirective';
import { WebGlObjectDirective, MathDirective } from './WebGlObjectDirective';
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

    get gl() : WebGLRenderingContext {
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
                this.cube = webGlObjects.find(x => x.name === "cube");                
                this.isInitialized = true;
            });            
        });
    }

    private setUpEvents() {

        let mouseMoveUnsubscribe: any;

        fromEvent(this.globalReference.document, 'keydown')
        .subscribe((event: KeyboardEvent) => {
            switch (event.key) {
                case 'Escape':
                this.globalReference.document.exitPointerLock();
                break;
                case 'w':
                case 's':
                    mat4.translate(this.camera.modelViewMatrix,
                        this.camera.modelViewMatrix, 
                        [0, 0, event.key === 'w' ? 1 : -1]);
                    break;
                case 'a':
                case 'd':
                    mat4.translate(this.camera.modelViewMatrix,
                        this.camera.modelViewMatrix, 
                        [event.key === 'a' ? 1 : -1, 0, 0]);
                break;
                default: break;
            }
        });


        fromEvent(this.canvas.context.canvas, 'click',)
        .subscribe((event: MouseEvent) => {
            this.canvas.context.canvas.requestPointerLock();
        });

        fromEvent(this.globalReference.document, 'pointerlockchange')
        .subscribe(()=> {
            if (this.globalReference.document.pointerLockElement === this.canvas.context.canvas) {   
                mouseMoveUnsubscribe = fromEvent(this.globalReference.document, 'mousemove')
                .subscribe((event: MouseEvent)=>{

                    var trans = vec3.create();
                    var temp = mat4.create();
                    mat4.getTranslation(trans, this.camera.modelViewMatrix);
                    mat4.translate(temp, temp, trans);
                    mat4.rotate(temp, temp, 
                        event.movementX * this.camera.fieldOfView / this.canvas.context.canvas.width
                    , [0,1,0]);
                    mat4.copy(this.camera.modelViewMatrix, temp);
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

        const normalMatrix = mat4.create();
        mat4.invert(normalMatrix, this.camera.modelViewMatrix);
        mat4.transpose(normalMatrix, normalMatrix);

        // Tell WebGL to use our program when drawing
        this.gl.useProgram(this.program);

        // Set the shader uniforms
        this.gl.uniformMatrix4fv(
            this.uniformLocations.projectionMatrix,
            false,
            this.camera.projectionMatrix);
        this.gl.uniformMatrix4fv(
            this.uniformLocations.modelViewMatrix,
            false,
            this.camera.modelViewMatrix);

        this.gl.uniformMatrix4fv(
            this.uniformLocations.normalMatrix,
            false,
            normalMatrix);

        {
            const currentModelView = mat4.create();
            for (let i = 0; i < state.length; i++) {
                if (state[i]) {
                    const x = (i % constraints.cols) - constraints.cols / 2;
                    const y = -((i / constraints.cols | 0) - constraints.rows / 2);

                    mat4.translate(currentModelView, this.camera.modelViewMatrix, [x, y, 0.0]);
                    this.gl.uniformMatrix4fv(
                        this.uniformLocations.modelViewMatrix,
                        false,
                        currentModelView);
                    this.cube.bind(this.attributes);
                    this.cube.draw();
                }
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

