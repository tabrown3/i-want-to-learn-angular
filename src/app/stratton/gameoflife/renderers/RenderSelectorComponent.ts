import { Component, ElementRef, ViewChild, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InjectToken } from '../../stratton.injection';

import { TextRendererComponent } from '../renderers/TextRendererComponent';
import { CanvasRendererComponent } from '../renderers/CanvasRendererComponent';

export enum GameOfLifeRendererEnum {
    text,
    canvas
}

@Component({
    selector: 'app-gameoflife-renderselector',
    template:
    `
    <app-gameoflife-textrenderer *ngIf="isSelected('text')"></app-gameoflife-textrenderer>
    <app-gameoflife-canvasrenderer *ngIf="isSelected('canvas')"></app-gameoflife-canvasrenderer>
    `
})
export class RendererSelectorComponent {

    @ViewChild(TextRendererComponent)
    private textRenderer: TextRendererComponent;

    @ViewChild(CanvasRendererComponent)
    private canvasRenderer: CanvasRendererComponent;

    selectedRenderer: GameOfLifeRendererEnum;

    constructor() {
        this.selectedRenderer = GameOfLifeRendererEnum.text;
    }

    private isSelected(name: string) {
        return this.selectedRenderer === GameOfLifeRendererEnum[name];
    }

    get renderer(): Stratton.IGameOfLifeRenderer {
        switch (this.selectedRenderer) {
            case GameOfLifeRendererEnum.text:
                return this.textRenderer;
            case GameOfLifeRendererEnum.canvas:
                return this.canvasRenderer;
            default:
                return null;
        }
    }
}
