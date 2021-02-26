import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TracesComponent} from './traces.component';
import {AuthGuard} from '../core';

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
