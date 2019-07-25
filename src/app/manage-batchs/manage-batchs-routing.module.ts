import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuard} from '../core/services';
import {ManageBatchsComponent} from './manage-batchs.component';

const routes: Routes = [
  {
    path: '',
    component: ManageBatchsComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageBatchsRoutingModule {}
