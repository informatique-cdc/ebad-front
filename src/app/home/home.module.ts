import { NgModule } from '@angular/core';

import { HomeComponent } from './home.component';
import { HomeAuthResolver } from './home-auth-resolver.service';
import { SharedModule } from '../shared';
import { HomeRoutingModule } from './home-routing.module';
import {AccreditationRequestModule} from "../accreditation-requests/accreditation-request.module";

@NgModule({
  imports: [
    SharedModule,
    HomeRoutingModule,
    AccreditationRequestModule,
  ],
  declarations: [
    HomeComponent
  ],
  providers: [
    HomeAuthResolver
  ]
})
export class HomeModule {}
