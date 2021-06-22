import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '../core';
import {AdminNormsComponent} from './admin-norms.component';

const routes: Routes = [
  {
    path: '',
    component: AdminNormsComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminNormsRoutingModule {
}
