import {
    Component, OnInit, ElementRef, ViewChild,
    OnDestroy, NgZone, InjectionToken, Inject, AfterViewInit, QueryList } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { GameOfLifeService } from './gameOfLifeService';
import { RendererSelectorComponent, GameOfLifeRendererEnum } from './renderers/RenderSelectorComponent';

import { InjectToken} from '../stratton.injection';

@Component({
    selector: 'app-game-of-life',
    templateUrl: './gameOfLifeTemplate.html'
})
export class GameOfLifeComponent implements OnDestroy {

    isRunning = false;
    renderer: RendererSelectorComponent;

    constructor(
        @Inject(InjectToken.IGameOfLifeService) private gameOfLifeService: Stratton.IGameOfLifeService,
        @Inject(InjectToken.IGlobalReference) private globalReference: Stratton.IGlobalReference,
        private ngZone: NgZone
    ) {      }

    @ViewChild(RendererSelectorComponent)
    set rendererSelector(component: RendererSelectorComponent) {
        this.renderer = component;
        component.subscribe((renderer) => {
            this.gameOfLifeService.renderer = renderer;
            this.gameOfLifeService.render();
        });
    }

    ngOnDestroy(): void {
        this.stopGame();
    }

    get constraintModel(): Stratton.IGameOfLifeConstraints {
        return this.gameOfLifeService.constraints;
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
}


