import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AccreditationRequestComponent} from './accreditation-request.component';
import {AuthGuard} from '../core/services';

const routes: Routes = [
  {
    path: '',
    component: AccreditationRequestComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccreditationRequestRoutingModule {}
