import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {TracesComponent} from './traces.component';
import {AuthGuard} from '../core/services';

const routes: Routes = [
  {
    path: '',
    component: TracesComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TracesRoutingModule {}
