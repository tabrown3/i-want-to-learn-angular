import {
    Component, OnInit, ElementRef, ViewChild,
    OnDestroy, NgZone, InjectionToken, Inject, AfterViewInit, QueryList } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { GameOfLifeService } from './gameOfLifeService';
import { CanvasRendererComponent } from './renderers/CanvasRendererComponent';

import { InjectToken } from '../stratton.injection';

@Component({
    selector: 'app-game-of-life',
    templateUrl: './gameOfLifeTemplate.html'
})
export class GameOfLifeComponent implements OnInit, OnDestroy, AfterViewInit {

    renderingContext: CanvasRenderingContext2D = null;
    @ViewChild(CanvasRendererComponent) renderer: CanvasRendererComponent;

    private isRunning = false;

    constructor(
        @Inject(InjectToken.IGameOfLifeService) private gameOfLifeService: Stratton.IGameOfLifeService,
        @Inject(InjectToken.IGlobalReference) private globalReference: Stratton.IGlobalReference,
        private ngZone: NgZone
    ) {      }

    ngOnInit() {
    }

    ngAfterViewInit(): void {
        this.gameOfLifeService.renderer = this.renderer;
    }

    ngOnDestroy(): void {
        this.stopGame();
    }

    get constraintModel(): Stratton.IGameOfLifeConstraints {
        return this.gameOfLifeService.constraints;
    }

    public startGame(): void {
        this.isRunning = true;
        this.ngZone.runOutsideAngular(() => this.renderFrame());
    }

    public stopGame(): void {
        this.isRunning = false;
    }

    public randomize(): void {
        this.isRunning = false;
        this.gameOfLifeService.randomize();
    }

    private renderFrame(): void {
        if (!this.isRunning) {
            return;
        }

        this.gameOfLifeService.tick();
        this.gameOfLifeService.render();
        this.globalReference.requestAnimationFrame(() => this.renderFrame());
    }
}


