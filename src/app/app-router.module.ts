import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { SpaceAgencyHomeComponent } from './brown/space-agency-home/space-agency-home.component';
import { SuperCoolComponent } from './saeed/super-cool/super-cool.component';
import { BrownComponent } from './brown/brown.component';
import { SaeedComponent } from './saeed/saeed.component';

const routes: Routes = [
  { path: 'brown', component: BrownComponent, children: [
    { path: 'space-agency-home', component: SpaceAgencyHomeComponent }
  ] },
  { path: 'saeed', component: SaeedComponent, children: [
    { path: 'super-cool', component: SuperCoolComponent }
  ] },
  { path: '**', redirectTo: 'brown' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRouterModule {

 }
