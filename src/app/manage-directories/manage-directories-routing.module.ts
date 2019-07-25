import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuard} from '../core/services';
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
