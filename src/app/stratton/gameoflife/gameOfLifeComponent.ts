import { Directive, Component, OnInit, ElementRef, ViewChild, OnDestroy, NgZone, InjectionToken, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { GameOfLifeService } from './gameOfLifeService';

import { InjectToken } from '../stratton.injection';

@Component({
    selector: 'app-game-of-life',
    templateUrl: './gameOfLifeTemplate.html'
})
export class GameOfLifeComponent implements OnInit, OnDestroy {

    renderingContext: CanvasRenderingContext2D = null;
    @ViewChild('gameOfLifeRenderer') gameOfLifeCanvas: ElementRef;

    columnCount: number;
    rowCount: number;
    cellSize: number;

    private isRunning = false;

    constructor(
        @Inject(InjectToken.IGameOfLifeService) private gameOfLifeService: Stratton.IGameOfLifeService,
        @Inject(InjectToken.IGlobalReference) private globalReference: Stratton.IGlobalReference,
        private ngZone: NgZone
    ) {
        this.columnCount = 16;
        this.rowCount = 16;
        this.cellSize = 16;
      }

    ngOnInit() {
    }

    ngOnDestroy(): void {
        this.stopGame();
    }

    public startGame(): void {
        this.gameOfLifeService.constraints.cols = this.columnCount;
        this.gameOfLifeService.constraints.rows = this.rowCount;
        this.gameOfLifeService.constraints.cellSizeInPixels = this.cellSize;

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
        const context = this.gameOfLifeCanvas.nativeElement.getContext('2d');
        this.gameOfLifeService.tick();
        this.gameOfLifeService.render(context);
        this.globalReference.requestAnimationFrame(() => this.renderFrame());
    }
}


