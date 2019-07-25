import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuard} from '../core/services';
import {ManageChainsComponent} from './manage-chains.component';

const routes: Routes = [
  {
    path: '',
    component: ManageChainsComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageChainsRoutingModule {}
