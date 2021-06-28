import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '../core';
import {ManageIdentitiesComponent} from './manage-identities.component';

const routes: Routes = [
  {
    path: '',
    component: ManageIdentitiesComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageIdentitiesRoutingModule {
}
