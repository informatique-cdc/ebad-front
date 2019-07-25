import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuard} from '../core/services';
import {ChainsComponent} from './chains.component';

const routes: Routes = [
  {
    path: '',
    component: ChainsComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChainsRoutingModule {}
