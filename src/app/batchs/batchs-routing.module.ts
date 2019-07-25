import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {BatchsComponent} from './batchs.component';
import {AuthGuard} from '../core/services';

const routes: Routes = [
  {
    path: '',
    component: BatchsComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BatchsRoutingModule {}
