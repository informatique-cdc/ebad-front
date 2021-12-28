import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ApiDocsComponent} from './api-docs.component';
import {AuthGuard} from '../core';

const routes: Routes = [
  {
    path: '',
    component: ApiDocsComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApiDocsRoutingModule {}
