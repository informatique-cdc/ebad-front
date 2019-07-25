import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '../core/services';
import {ManageEnvironmentsComponent} from './manage-environments.component';

const routes: Routes = [
  {
    path: '',
    component: ManageEnvironmentsComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageEnvironmentsRoutingModule {
}
