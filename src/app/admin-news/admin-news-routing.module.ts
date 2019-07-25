import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '../core/services';
import {AdminNewsComponent} from './admin-news.component';

const routes: Routes = [
  {
    path: '',
    component: AdminNewsComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminNewsRoutingModule {
}
