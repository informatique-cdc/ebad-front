import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BatchsComponent} from './batchs.component';
import {AuthGuard} from '../core';

const routes: Routes = [
  {
    path: '',
    component: BatchsComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BatchsRoutingModule {}
