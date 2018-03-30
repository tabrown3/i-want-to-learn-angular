import { NgModule } from '@angular/core';
import { Route } from '@angular/router';

import { StrattonComponent } from './components/stratton.component';

@NgModule({
    declarations: [StrattonComponent]
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


