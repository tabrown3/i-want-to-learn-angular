declare namespace Stratton {

    export interface IGlobalReference {
        requestAnimationFrame(callback: FrameRequestCallback): void;
        document: Document;   
        setTimeout: (handler: (...args: any[]) => void, timeout: number) => number;
    }

}

