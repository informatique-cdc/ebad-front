import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '../core';
import {ManageNamingComponent} from './manage-naming.component';

const routes: Routes = [
  {
    path: '',
    component: ManageNamingComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageNamingRoutingModule {
}
