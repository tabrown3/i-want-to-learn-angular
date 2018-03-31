import { NgModule, InjectionToken } from '@angular/core';
import { RouterModule, Route } from '@angular/router';

import { StrattonComponent } from './components/stratton.component';
import { GameOfLifeService } from './gameoflife/gameOfLifeService';
import { GameOfLifeComponent } from './gameoflife/gameOfLifeComponent';

import { InjectToken } from './stratton.injection';

@NgModule({
    imports : [RouterModule],
    declarations: [StrattonComponent, GameOfLifeComponent],
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
            component : StrattonComponent,
            children : [
                {path : 'game-of-life', component: GameOfLifeComponent}
            ]
        };
    }
}


