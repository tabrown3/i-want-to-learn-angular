import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SpaceAgencyHomeComponent } from './brown/space-agency-home/space-agency-home.component';
import { SuperCoolComponent } from './saeed/super-cool/super-cool.component';
import { BrownComponent } from './brown/brown.component';
import { SaeedComponent } from './saeed/saeed.component';
import {StrattonModule} from './stratton/stratton.module';
import {PinedoComponent} from './pinedo/pinedo.component';
import {DaramComponent} from './daram/daram.component';
import {MamedbekovComponent} from './mamedbekov/mamedbekov.component';
import {WuComponent} from './wu/wu.component';
import {HamiltonComponent} from './hamilton/hamilton.component';
// import {GrayComponent} from './gray/gray.component';
import {JamesComponent} from './james/james.component';
import {ViswamaniComponent} from './viswamani/viswamani.component';
import {HochComponent} from './hoch/hoch.component';
import {PatelComponent} from './patel/patel.component';
import {TranComponent} from './tran/tran.component';

const routes: Routes = [
  { path: 'brown', component: BrownComponent, children: [
    { path: 'space-agency-home', component: SpaceAgencyHomeComponent }
  ] },
  { path: 'saeed', component: SaeedComponent, children: [
    { path: 'super-cool', component: SuperCoolComponent }
  ] },
  StrattonModule.GetRoute('stratton'),
  { path: 'pinedo', component: PinedoComponent },
  { path: 'daram', component: DaramComponent },
  { path: 'mamedbekov', component: MamedbekovComponent },
  { path: 'wu', component: WuComponent },
  { path: 'hamilton', component: HamiltonComponent },
  // { path: 'gray', component: GrayComponent },
  { path: 'tran', component: TranComponent },
  { path: 'james', component: JamesComponent },
  { path: 'viswamani', component: ViswamaniComponent },
  { path: 'hoch', component: HochComponent },
  { path: 'patel', component: PatelComponent },
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
