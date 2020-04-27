import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoadingComponent} from "./loading.component";
import {NoAuthGuard} from "../auth/no-auth-guard.service";


const routes: Routes = [
  {
    path: '',
    component: LoadingComponent,
    canActivate: [NoAuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoadingRoutingModule {}
