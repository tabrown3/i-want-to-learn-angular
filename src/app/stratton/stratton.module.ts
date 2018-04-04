import { NgModule, InjectionToken } from '@angular/core';
import { RouterModule, Route } from '@angular/router';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { StrattonComponent } from './components/stratton.component';
import { GameOfLifeService } from './gameoflife/gameOfLifeService';
import { GameOfLifeComponent } from './gameoflife/gameOfLifeComponent';

// import { InjectToken } from './stratton.injection';
import { InjectToken} from './stratton.injection';

import { CanvasRendererComponent } from './gameoflife/renderers/CanvasRendererComponent';
import { TextRendererComponent } from './gameoflife/renderers/TextRendererComponent';
import { WebGlRendererComponent } from './gameoflife/renderers/WebGlRendererComponent';

import { RendererSelectorComponent } from './gameoflife/renderers/RenderSelectorComponent';


@NgModule({
    imports : [RouterModule, FormsModule, CommonModule],
    declarations: [
        StrattonComponent, GameOfLifeComponent, CanvasRendererComponent,
        TextRendererComponent, RendererSelectorComponent, WebGlRendererComponent],
    providers: [
        {
            provide: InjectToken.IGlobalReference,
            useValue: window
        },
        {
            provide: InjectToken.IGameOfLifeService,
            useClass: GameOfLifeService
        }]
})
export class StrattonModule {

    // static method to allow module to define all routes availble
    public static GetRoute(rootPath: string): Route {

        return {
            path : rootPath,
            component : StrattonComponent
        };
    }
}


