import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '../core';
import {ManageDirectoriesComponent} from './manage-directories.component';

const routes: Routes = [
  {
    path: '',
    component: ManageDirectoriesComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageDirectoriesRoutingModule {}
