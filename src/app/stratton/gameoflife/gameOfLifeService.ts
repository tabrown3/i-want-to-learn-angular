/* tslint:disable:no-bitwise */

import { Injectable } from '@angular/core';

@Injectable()
export class GameOfLifeService implements Stratton.IGameOfLifeService {

    readonly constraints: Stratton.IGameOfLifeConstraints;
    renderer: Stratton.IGameOfLifeRenderer;
    statebuffer0: Int8Array;
    statebuffer1: Int8Array;
    bufferInUse = 0;

    readonly neighbours: Stratton.IPoint[] = [
        {x: -1, y: -1}, {x:  0, y: -1}, {x:  1, y: -1},
        {x: -1, y:  0},               , {x:  1, y:  0},
        {x: -1, y:  1}, {x:  0, y:  1}, {x:  1, y:  1}
    ];

    constructor() {
        this.constraints = {
            rows: 64,
            cols: 64,
            cellSizeInPixels: 10,
            isTorus: true,
            livingColor: 0xFFFFFF,
            deathColor: 0x000000,
            frameDelay: 100
        };

        this.reset();
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
            let dx = point.x + x;
            let dy = point.y + y;

            if (this.constraints.isTorus) {
                dx = (dx + this.constraints.cols) % this.constraints.cols;
                dy = (dy + this.constraints.rows) % this.constraints.rows;
            }

            if (dx >= 0 && dx < this.constraints.cols &&
                dy >= 0 && dy < this.constraints.rows) {
                    const neighbourIndex = dy * this.constraints.cols + dx;
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

    render(): void {
        if (this.renderer) {
            this.renderer.render(this.state, this.constraints);
        }
    }

}
/* tslint:enable:no-bitwise */
