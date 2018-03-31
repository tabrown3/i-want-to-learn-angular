/* tslint:disable:no-bitwise */

import { Injectable } from '@angular/core';

@Injectable()
export class GameOfLifeService implements Stratton.IGameOfLifeService {

    readonly constraints: Stratton.IGameOfLifeConstraints;
    statebuffer0: Int8Array;
    statebuffer1: Int8Array;
    bufferInUse = 0;

    readonly livingColor: 0xFFFFFF;
    readonly deathColor: 0x000000;

    readonly neighbours: Stratton.IPoint[] = [
        {x: -1, y: -1}, {x:  0, y: -1}, {x:  1, y: -1},
        {x: -1, y:  0},               , {x:  1, y:  0},
        {x: -1, y:  1}, {x:  0, y:  1}, {x:  1, y:  1}
    ];

    constructor() {
        this.constraints = {
            rows: 16,
            cols: 16,
            cellSizeInPixels: 10,
        };

        this.statebuffer0 = new Int8Array(this.dataSize);
        this.statebuffer1 = new Int8Array(this.dataSize);
    }

    reset(): void {
        this.statebuffer0 = new Int8Array(this.dataSize);
        this.statebuffer1 = new Int8Array(this.dataSize);
    }

    tick(): void {
        const source = this.state;
        const destination = source === this.statebuffer0 ? this.statebuffer1 : this.statebuffer0;

        for (let index = 0; index < this.dataSize; index++) {
            destination[index] = this.willCellBeAlive(source, index) ? 1 : 0;
        }

        this.bufferInUse = (this.bufferInUse + 1) % 2;
    }

    randomize(): void {
        for (let n = 0; n < this.dataSize * .3; n++) {
            const randomIndex = Math.random() * this.dataSize;
            this.state[randomIndex | 0] = 1;
        }
    }

    private willCellBeAlive(buffer: Int8Array, index: number): boolean {
        const cellIsCurrentlyAlive = !!buffer[index];
        const livingNeighbourCount = this.getLiveCount(buffer, index);
        return cellIsCurrentlyAlive
            ? livingNeighbourCount >= 2 && livingNeighbourCount <= 3
            : livingNeighbourCount === 3;
    }

    private getLiveCount(buffer: Int8Array, index: number): number {
        const x = index % this.constraints.cols;
        const y = index / this.constraints.cols | 0;

        return this.neighbours.reduce((acc, point) => {
            if (point.x + x >= 0 && point.x + x < this.constraints.cols &&
                point.y + y >= 0 && point.y + y < this.constraints.rows) {
                    const neighbourIndex = (point.y + y) * this.constraints.cols + (point.x + x);
                    acc += buffer[neighbourIndex] ? 1 : 0;
            }
            return acc;
        }, 0);
    }

    get dataSize(): number {
        return this.constraints.cols * this.constraints.rows;
    }

    get state(): Int8Array {
        return this.bufferInUse ? this.statebuffer1 : this.statebuffer0;
    }

    render(context: CanvasRenderingContext2D): void {
        const scale = this.constraints.cellSizeInPixels;
        const imageData = context.getImageData(0, 0, this.constraints.cols, this.constraints.rows);

        for (let index = 0; index < this.dataSize; index++) {
            const imageIndex = index * 4;
            const pointState: number = this.state[index] ? this.livingColor : this.deathColor;
            imageData.data[imageIndex + 0] = 255;
            imageData.data[imageIndex + 1] = 0;
            imageData.data[imageIndex + 2] = 255;
            imageData.data[imageIndex + 3] = 255;
        }
        context.putImageData(imageData, 0, 0);
    }

}
/* tslint:enable:no-bitwise */
