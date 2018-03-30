import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AppRouterModule } from './app-router.module';
import { SpaceAgencyHomeComponent } from './brown/space-agency-home/space-agency-home.component';
import { SuperCoolComponent } from './saeed/super-cool/super-cool.component';
import { BrownComponent } from './brown/brown.component';
import { SaeedComponent } from './saeed/saeed.component';
import { HeaderComponent } from './header/header.component';
import {StrattonModule} from './stratton/stratton.module';
import {DaramComponent} from './daram/daram.component';
import {WuComponent} from './wu/wu.component';
import {HamiltonComponent} from './hamilton/hamilton.component';
// import {GrayComponent} from './gray/gray.component';
import {TranComponent} from './tran/tran.component';
import {PinedoComponent} from './pinedo/pinedo.component';
import {LaunchListComponent} from './brown/space-agency-home/launch-list/launch-list.component';
import {SpaceHeaderComponent} from './brown/space-header/space-header.component';
import {JamesComponent} from './james/james.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ViswamaniComponent} from './viswamani/viswamani.component';
import {HochComponent} from './hoch/hoch.component';
import {PatelComponent} from './patel/patel.component';

// Tony Start
import {MamedbekovComponent} from './mamedbekov/mamedbekov.component';
import {SearchHomeComponent} from './mamedbekov/app-search-home/app-search-home.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    BrownComponent,
    SpaceHeaderComponent,
    SpaceAgencyHomeComponent,
    LaunchListComponent,
    SaeedComponent,
    SuperCoolComponent,
    MamedbekovComponent,

    DaramComponent,
    WuComponent,
    HamiltonComponent,
    // GrayComponent,
    TranComponent,
    PinedoComponent,
    JamesComponent,
    ViswamaniComponent,
    HochComponent,
    PatelComponent,
    SearchHomeComponent
  ],
  imports: [
    BrowserModule,
    AppRouterModule,
    FormsModule,
    NgbModule.forRoot(),
    StrattonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
