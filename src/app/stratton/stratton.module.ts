import { NgModule, InjectionToken } from '@angular/core';
import { RouterModule, Route } from '@angular/router';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { StrattonComponent } from './stratton.component';
import { BoardService } from './gameoflife/boardService';
import { GameOfLifeComponent } from './gameoflife/gameOfLifeComponent';

// import { InjectToken } from './stratton.injection';
import { InjectToken} from './gameoflife/gameOfLife.injection';

import { CanvasRendererComponent } from './gameoflife/renderers/CanvasRendererComponent';
import { TextRendererComponent } from './gameoflife/renderers/TextRendererComponent';
import { WebGlRendererComponent } from './gameoflife/renderers/WebGlRendererComponent';
import { GlslShaderDirective } from './gameoflife/renderers/GlslShaderDirective';

import { RendererSelectorComponent } from './gameoflife/renderers/RenderSelectorComponent';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
    imports : [RouterModule, FormsModule, CommonModule, HttpClientModule],
    declarations: [
        StrattonComponent, GameOfLifeComponent, CanvasRendererComponent,
        TextRendererComponent, RendererSelectorComponent, WebGlRendererComponent, GlslShaderDirective],
    providers: [
        {
            provide: InjectToken.IGlobalReference,
            useValue: window
        },
        {
            provide: InjectToken.IBoardService,
            useClass: BoardService
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


