declare namespace Stratton.GameOfLife {

    export interface IGlobalReference {
        requestAnimationFrame(callback: FrameRequestCallback): void;
        document: Document;   
        setTimeout: (handler: (...args: any[]) => void, timeout: number) => number;
    }

    export interface IPoint {
        x: number;
        y: number;
    }

    export interface IConstraints {
        rows: number;
        cols: number;

        cellSizeInPixels: number;
        isTorus: boolean;

        livingColor: number,
        deathColor: number,

        frameDelay: number
    }

    export interface IBoardService {
        constraints: IConstraints;
        readonly state: Int8Array;

        renderer: IRenderer;

        reset(): void;
        tick(): void;
        randomize(): void;
        render(): void;
    }

    export interface IRenderer {
        initialize(constraints: IConstraints);
        render(state: Int8Array, constraints: IConstraints);
    }

    export interface IGlslShaderSource {
        shaderType: string;
        source: string;
    }

    export interface IWebGlMesh {
        positions: number[];
        cells: number[];
        vertexUVs: number[];
        faceUVs: number[];
        vertexNormals: number[];
        faceNormals: number[];
        name: string;
        faceCount: number;
    }

    export interface IWebGlObject {
        readonly name: string;
        bind(attributes: Stratton.GameOfLife.IWebGlAttributes): void;
        draw(): void;
    }

    export interface IWebGlObjectBuffers {
        position: any;
        normal: any;
        color: any;
        indices: any;
    }

    export interface IWebGlAttributes {
        vertexPosition: any;
        vertexColor: any;
        vertexNormal: any;
    }

    export interface IWebGlUniformLocations {
        projectionMatrix: WebGLUniformLocation;
        modelViewMatrix: WebGLUniformLocation;
        normalMatrix: WebGLUniformLocation;
    }

    
}

