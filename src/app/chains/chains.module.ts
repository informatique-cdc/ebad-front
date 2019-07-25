import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChainsComponent } from './chains.component';
import {ChainsRoutingModule} from './chains-routing.module';
import {SharedModule} from '../shared';

@NgModule({
  declarations: [ChainsComponent],
  imports: [
    ChainsRoutingModule,
    SharedModule
  ]
})
export class ChainsModule { }
