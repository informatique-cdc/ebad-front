import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TerminalComponent} from './terminal.component';
import {AuthGuard} from '../core';

const routes: Routes = [
  {
    path: '',
    component: TerminalComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TerminalRoutingModule {}
