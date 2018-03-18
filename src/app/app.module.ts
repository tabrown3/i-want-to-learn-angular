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


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    BrownComponent,
    SpaceAgencyHomeComponent,
    SaeedComponent,
    SuperCoolComponent
  ],
  imports: [
    BrowserModule,
    AppRouterModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
