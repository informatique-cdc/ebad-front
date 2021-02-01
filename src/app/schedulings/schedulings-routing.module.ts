import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SchedulingsComponent} from './schedulings.component';
import {AuthGuard} from '../core';

const routes: Routes = [
  {
    path: '',
    component: SchedulingsComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SchedulingsRoutingModule {}
