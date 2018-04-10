import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TextRendererComponent } from '../renderers/TextRendererComponent';
import { CanvasRendererComponent } from '../renderers/CanvasRendererComponent';
import { WebGlRendererComponent } from '../renderers/WebGlRendererComponent';

import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';

export enum GameOfLifeRendererEnum {
    text,
    canvas,
    webgl
}

@Component({
    selector: 'app-gameoflife-renderselector',
    template:
    `
    <app-gameoflife-textrenderer *ngIf="isSelected('text')"></app-gameoflife-textrenderer>
    <app-gameoflife-canvasrenderer *ngIf="isSelected('canvas')"></app-gameoflife-canvasrenderer>
    <app-gameoflife-webglrenderer *ngIf="isSelected('webgl')"></app-gameoflife-webglrenderer>
    `,
    styles: [':host{ display: block; width: 100%;}']
})
export class RendererSelectorComponent extends Observable<Stratton.GameOfLife.IRenderer> {

    private selectedRenderer: GameOfLifeRendererEnum = GameOfLifeRendererEnum.text;
    private subscriber: Subscriber<Stratton.GameOfLife.IRenderer>;

    constructor() {
        super(observer => {
            this.subscriber = new Subscriber<Stratton.GameOfLife.IRenderer>((val) => {
                observer.next(val);
            });
        });
        this.selectedRenderer = GameOfLifeRendererEnum.text;
    }

    @ViewChild(TextRendererComponent)
    set textRenderer(component: TextRendererComponent) {
        if (component) {
            this.subscriber.next(component);
        }
    }

    @ViewChild(CanvasRendererComponent)
    set canvasRenderer(component: CanvasRendererComponent) {
        if (component) {
            this.subscriber.next(component);
        }
    }

    @ViewChild(WebGlRendererComponent)
    set webGlRenderer(component: WebGlRendererComponent) {
        if (component) {
            this.subscriber.next(component);
        }
    }

    public get rendererType() {
        return this.selectedRenderer;
    }

    public set rendererType(val: GameOfLifeRendererEnum) {
        if (this.selectedRenderer !== val) {
            this.selectedRenderer = val;
        }
    }

    public isSelected(name: string) {
        return this.selectedRenderer === GameOfLifeRendererEnum[name];
    }
}
