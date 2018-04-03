declare namespace Stratton {

    export interface IGlobalReference {
        requestAnimationFrame(callback: FrameRequestCallback): void;
        document: Document;        
    }

    export interface IPoint {
        x: number;
        y: number;
    }

    export interface IGameOfLifeConstraints {
        rows: number;
        cols: number;

        cellSizeInPixels: number;
        isTorus: boolean;

        livingColor: number,
        deathColor: number
    }

    export interface IGameOfLifeService {
        constraints: IGameOfLifeConstraints;
        readonly state: Int8Array;

        renderer: IGameOfLifeRenderer;

        reset(): void;
        tick(): void;
        randomize(): void;
        render(): void;
    }

    export interface IGameOfLifeRenderer {
        initialize(constraints: IGameOfLifeConstraints);
        render(state: Int8Array, constraints: IGameOfLifeConstraints);
    }
}

