import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '../core';
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
