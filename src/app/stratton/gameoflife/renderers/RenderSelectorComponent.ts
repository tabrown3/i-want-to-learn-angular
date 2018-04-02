import { Component, ElementRef, ViewChild, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InjectToken } from '../../stratton.injection';

import { TextRendererComponent } from '../renderers/TextRendererComponent';
import { CanvasRendererComponent } from '../renderers/CanvasRendererComponent';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';

export enum GameOfLifeRendererEnum {
    text,
    canvas
}

type Nextable = () => void;

@Component({
    selector: 'app-gameoflife-renderselector',
    template:
    `
    <app-gameoflife-textrenderer *ngIf="isSelected('text')"></app-gameoflife-textrenderer>
    <app-gameoflife-canvasrenderer *ngIf="isSelected('canvas')"></app-gameoflife-canvasrenderer>
    `
})
export class RendererSelectorComponent extends Observable<Stratton.IGameOfLifeRenderer> {

    private selectedRenderer: GameOfLifeRendererEnum = GameOfLifeRendererEnum.text;
    private subscriber: Subscriber<Stratton.IGameOfLifeRenderer>;

    constructor() {
        super(observer => {
            this.subscriber = new Subscriber<Stratton.IGameOfLifeRenderer>((val) => {
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

    public get rendererType() {
        return this.selectedRenderer;
    }

    public set rendererType(val: GameOfLifeRendererEnum) {
        if (this.selectedRenderer !== val) {
            this.selectedRenderer = val;
        }
    }

    private isSelected(name: string) {
        return this.selectedRenderer === GameOfLifeRendererEnum[name];
    }
}
