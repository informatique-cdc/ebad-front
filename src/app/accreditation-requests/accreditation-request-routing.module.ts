import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '../core/services';
import {SynthesisAccreditationRequest} from "./synthesis-accreditation-request.component";

const routes: Routes = [
  {
    path: '',
    component: SynthesisAccreditationRequest,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccreditationRequestRoutingModule {}
