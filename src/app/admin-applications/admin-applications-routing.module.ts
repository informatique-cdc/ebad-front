import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '../core/services';
import {AdminApplicationsComponent} from './admin-applications.component';

const routes: Routes = [
  {
    path: '',
    component: AdminApplicationsComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminApplicationsRoutingModule {
}
