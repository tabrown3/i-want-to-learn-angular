declare namespace Stratton {

    export interface IGlobalReference {
        requestAnimationFrame(callback: FrameRequestCallback): void;
    }

    export interface IPoint {
        x: number;
        y: number;
    }

    export interface IGameOfLifeConstraints {
        rows: number;
        cols: number;

        cellSizeInPixels: number;
    }

    export interface IGameOfLifeService {
        constraints: IGameOfLifeConstraints;
        readonly state: Int8Array;

        reset(): void;
        tick(): void;
        randomize(): void;
        render(context: CanvasRenderingContext2D): void;
    }
}

