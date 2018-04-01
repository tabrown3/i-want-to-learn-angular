import {
    Component, OnInit, ElementRef, ViewChild,
    OnDestroy, NgZone, InjectionToken, Inject, AfterViewInit, QueryList } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { GameOfLifeService } from './gameOfLifeService';
import { RendererSelectorComponent, GameOfLifeRendererEnum } from './renderers/RenderSelectorComponent';

import { InjectToken } from '../stratton.injection';

@Component({
    selector: 'app-game-of-life',
    templateUrl: './gameOfLifeTemplate.html'
})
export class GameOfLifeComponent implements OnInit, OnDestroy, AfterViewInit {

    @ViewChild(RendererSelectorComponent) rendererSelector: RendererSelectorComponent;

    private isRunning = false;

    constructor(
        @Inject(InjectToken.IGameOfLifeService) private gameOfLifeService: Stratton.IGameOfLifeService,
        @Inject(InjectToken.IGlobalReference) private globalReference: Stratton.IGlobalReference,
        private ngZone: NgZone
    ) {      }

    ngOnInit() {
    }

    ngAfterViewInit(): void {
        this.updateRenderer();
    }

    ngOnDestroy(): void {
        this.stopGame();
    }

    get constraintModel(): Stratton.IGameOfLifeConstraints {
        return this.gameOfLifeService.constraints;
    }

    get selectedRendererType(): string {
        return GameOfLifeRendererEnum[this.rendererSelector.selectedRenderer];
    }

    set selectedRendererType(type: string) {
        this.rendererSelector.selectedRenderer = GameOfLifeRendererEnum[type];
        this.updateRenderer();
    }

    public startGame(): void {
        this.isRunning = true;
        this.ngZone.runOutsideAngular(() => this.renderFrame());
    }

    public stopGame(): void {
        this.isRunning = false;
    }

    public resetGame(): void {
        this.stopGame();
        this.gameOfLifeService.reset();
    }

    public randomize(): void {
        this.isRunning = false;
        this.gameOfLifeService.reset();
        this.gameOfLifeService.randomize();
        this.gameOfLifeService.render();
    }

    private renderFrame(): void {
        if (!this.isRunning) {
            return;
        }

        this.gameOfLifeService.tick();
        this.ngZone.run(() => this.gameOfLifeService.render());
        this.globalReference.requestAnimationFrame(() => this.renderFrame());
    }

    private updateRenderer(): void {
        this.gameOfLifeService.renderer = this.rendererSelector.renderer;
        this.gameOfLifeService.render();
    }
}


