import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '../core/services';
import {ManageAccessControlComponent} from './manage-access-control.component';

const routes: Routes = [
  {
    path: '',
    component: ManageAccessControlComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageAccessControlRoutingModule {
}
