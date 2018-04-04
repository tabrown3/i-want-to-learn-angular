import {
    Component, OnInit, ElementRef, ViewChild,
    OnDestroy, NgZone, InjectionToken, Inject, AfterViewInit, QueryList } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { RendererSelectorComponent, GameOfLifeRendererEnum } from './renderers/RenderSelectorComponent';

import { InjectToken} from './gameOfLife.injection';

@Component({
    selector: 'app-game-of-life',
    templateUrl: './gameOfLifeTemplate.html'
})
export class GameOfLifeComponent implements OnDestroy {

    isRunning = false;
    renderer: RendererSelectorComponent;

    constructor(
        @Inject(InjectToken.IBoardService) private boardService: Stratton.GameOfLife.IBoardService,
        @Inject(InjectToken.IGlobalReference) private globalReference: Stratton.IGlobalReference,
        private ngZone: NgZone
    ) {      }

    @ViewChild(RendererSelectorComponent)
    set rendererSelector(component: RendererSelectorComponent) {
        this.renderer = component;
        component.subscribe((renderer) => {
            this.boardService.renderer = renderer;
            renderer.initialize(this.boardService.constraints);
            this.boardService.render();
        });
    }

    ngOnDestroy(): void {
        this.stopGame();
    }

    get constraintModel(): Stratton.GameOfLife.IConstraints {
        return this.boardService.constraints;
    }

    get selectedRendererType(): string {
        if (!this.renderer) {
            return null;
        }
        return GameOfLifeRendererEnum[this.renderer.rendererType];
    }

    set selectedRendererType(type: string) {
        if (this.renderer) {
            this.renderer.rendererType = GameOfLifeRendererEnum[type];
        }
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
        this.boardService.reset();
    }

    public randomize(): void {
        this.isRunning = false;
        this.boardService.reset();
        this.boardService.randomize();
        this.boardService.render();
    }

    private renderFrame(): void {
        if (!this.isRunning) {
            return;
        }

        this.boardService.tick();
        this.ngZone.run(() => this.boardService.render());

        this.globalReference.setTimeout(() => {
            this.globalReference.requestAnimationFrame(() => this.renderFrame());
        }, this.constraintModel.frameDelay);
    }
}


