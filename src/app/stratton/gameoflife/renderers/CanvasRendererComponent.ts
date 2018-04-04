/* tslint:disable:no-bitwise */

import { Component, ElementRef, ViewChild, AfterViewInit, Inject } from '@angular/core';

import { InjectToken } from '../gameOfLife.injection';

@Component({
    selector: 'app-gameoflife-canvasrenderer',
    template: `<canvas #canvas></canvas>`
})
export class CanvasRendererComponent implements AfterViewInit, Stratton.GameOfLife.IRenderer {

    context: CanvasRenderingContext2D;
    scratchContext: CanvasRenderingContext2D;
    imageData: ImageData;
    @ViewChild('canvas') canvasElement: ElementRef;

    constructor(@Inject(InjectToken.IGlobalReference) private globalReference: Stratton.IGlobalReference) {   }

    ngAfterViewInit(): void {
        this.context = this.canvasElement.nativeElement.getContext('2d');
        this.scratchContext = this.globalReference.document.createElement('canvas').getContext('2d');
    }

    initialize(constraints: Stratton.GameOfLife.IConstraints) {
        this.scratchContext.canvas.width = constraints.cols;
        this.scratchContext.canvas.height = constraints.rows;

        this.imageData = this.scratchContext.createImageData(constraints.cols, constraints.rows);
    }

    render(state: Int8Array, constraints: Stratton.GameOfLife.IConstraints) {
        const scale = constraints.cellSizeInPixels;

        this.context.canvas.width = constraints.cols * scale;
        this.context.canvas.height = constraints.rows * scale;

        for (let index = 0; index < state.length; index++) {
            const imageIndex = index * 4;
            const pointState: number = state[index] ? constraints.livingColor : constraints.deathColor;
            this.imageData.data[imageIndex + 0] = pointState & 0xFF0000;
            this.imageData.data[imageIndex + 1] = pointState & 0x00FF00;
            this.imageData.data[imageIndex + 2] = pointState & 0x0000FF;
            this.imageData.data[imageIndex + 3] = 255;
        }

        this.scratchContext.putImageData(this.imageData, 0, 0);
        this.context.save();
        this.context.scale(scale, scale);
        this.context.mozImageSmoothingEnabled = false;
        this.context.webkitImageSmoothingEnabled = false;
        this.context.imageSmoothingEnabled = false;
        this.context.drawImage(this.scratchContext.canvas, 0, 0);
        this.context.restore();
    }
}
/* tslint:enable:no-bitwise */

