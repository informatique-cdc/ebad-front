import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '../core';
import {SynthesisAccreditationRequestComponent} from './synthesis-accreditation-request.component';

const routes: Routes = [
  {
    path: '',
    component: SynthesisAccreditationRequestComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccreditationRequestRoutingModule {}
