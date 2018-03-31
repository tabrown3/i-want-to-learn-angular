/* tslint:disable:no-bitwise */

import { Component, ElementRef, ViewChild, AfterViewInit, Inject } from '@angular/core';

import { InjectToken } from '../../stratton.injection';

@Component({
    selector: 'app-gameoflife-canvasrenderer',
    template: `<canvas #canvas></canvas>`
})
export class CanvasRendererComponent implements AfterViewInit, Stratton.IGameOfLifeRenderer {

    context: CanvasRenderingContext2D;

    @ViewChild('canvas') canvasElement: ElementRef;
    scratchCanvas: HTMLCanvasElement;

    constructor(@Inject(InjectToken.IGlobalReference) private globalReference: Stratton.IGlobalReference) {   }

    ngAfterViewInit(): void {
        this.context = this.canvasElement.nativeElement.getContext('2d');
        this.scratchCanvas = this.globalReference.document.createElement('canvas');
    }

    render(state: Int8Array, constraints: Stratton.IGameOfLifeConstraints) {
        const scale = constraints.cellSizeInPixels;

        this.context.imageSmoothingEnabled = false;

        this.canvasElement.nativeElement.width = constraints.cols * scale;
        this.canvasElement.nativeElement.height = constraints.rows * scale;

        this.scratchCanvas.width = constraints.cols;
        this.scratchCanvas.height = constraints.rows;

        const scratchContext = this.scratchCanvas.getContext('2d');
        scratchContext.imageSmoothingEnabled = false;
        scratchContext.mozImageSmoothingEnabled = false;
        scratchContext.webkitImageSmoothingEnabled = false;

        const imageData = scratchContext.createImageData(constraints.cols, constraints.rows);

        for (let index = 0; index < state.length; index++) {
            const imageIndex = index * 4;
            const pointState: number = state[index] ? constraints.livingColor : constraints.deathColor;
            imageData.data[imageIndex + 0] = pointState & 0xFF0000;
            imageData.data[imageIndex + 1] = pointState & 0x00FF00;
            imageData.data[imageIndex + 2] = pointState & 0x0000FF;
            imageData.data[imageIndex + 3] = 255;
        }

        scratchContext.putImageData(imageData, 0, 0);
        this.context.drawImage(this.scratchCanvas, 0, 0, scale * constraints.cols, scale * constraints.rows);
    }
}
/* tslint:enable:no-bitwise */

