import { NgModule } from '@angular/core';
import { TracesComponent } from './traces.component';
import {TracesRoutingModule} from './traces-routing.module';
import {SharedModule} from '../shared';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [TracesComponent],
  imports: [
    TracesRoutingModule,
    SharedModule,
    NgbModule
  ]
})
export class TracesModule { }
