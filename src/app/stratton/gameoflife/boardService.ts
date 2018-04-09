/* tslint:disable:no-bitwise */
import { Injectable, Inject } from '@angular/core';
import { InjectToken} from './gameOfLife.injection';

@Injectable()
export class BoardService implements Stratton.GameOfLife.IBoardService {

    readonly constraints: Stratton.GameOfLife.IConstraints;
    renderer: Stratton.GameOfLife.IRenderer;
    statebuffer: Int8Array[];
    bufferInUse = 0;

    readonly neighbours: Stratton.GameOfLife.IPoint[] = [
        {x: -1, y: -1}, {x:  0, y: -1}, {x:  1, y: -1},
        {x: -1, y:  0},               , {x:  1, y:  0},
        {x: -1, y:  1}, {x:  0, y:  1}, {x:  1, y:  1}
    ];

    constructor(@Inject(InjectToken.IGlobalReference) private globalReference: Stratton.IGlobalReference) {
        this.constraints = {
            rows: 64,
            cols: 64,
            cellSizeInPixels: 10,
            isTorus: true,
            livingColor: 0xFFFFFF,
            deathColor: 0x000000,
            frameDelay: 50
        };

        this.reset();
    }

    reset(): void {
        this.statebuffer = [new Int8Array(this.dataSize), new Int8Array(this.dataSize)];
    }

    tick(): void {
        const nextBuffer = (this.bufferInUse + 1) % 2;
        const source = this.statebuffer[this.bufferInUse];
        const destination = this.statebuffer[nextBuffer];

        for (let index = 0; index < this.dataSize; index++) {
            destination[index] = this.willCellBeAlive(source, index) ? 1 : 0;
        }

        this.bufferInUse = nextBuffer;
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
        return this.statebuffer[this.bufferInUse];
    }

    render(): void {
        if (this.renderer) {
            this.renderer.render(this.state, this.constraints);
        }
    }

    loadFromFile(file: File) {
        const url = URL.createObjectURL(file);
        const image = new Image();

        image.onload = () => {
            URL.revokeObjectURL(url);
            const context = this.globalReference.document.createElement('canvas').getContext('2d');
            context.canvas.width = image.width;
            context.canvas.height = image.height;
            context.mozImageSmoothingEnabled = false;
            context.webkitImageSmoothingEnabled = false;
            context.imageSmoothingEnabled = false;
            context.drawImage(image, 0, 0);
            const imageData = context.getImageData(0, 0, image.width, image.height);

            this.constraints.rows = image.height;
            this.constraints.cols = image.width;
            this.reset();

            for (let n = 0; n < imageData.data.length; n += 4) {
                const data = imageData.data;
                const color = data[n] << 16 | data[n + 1] << 12 | data[n + 2] << 8 | data[n + 3];
                this.state[n / 4 | 0] = color === this.constraints.livingColor ? 1 : 0;
            }
        };
        image.src = url;
    }
}
/* tslint:enable:no-bitwise */
