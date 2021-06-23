import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '../core';
import {AdminIdentitiesComponent} from './admin-identities.component';

const routes: Routes = [
  {
    path: '',
    component: AdminIdentitiesComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminIdentitiesRoutingModule {
}
