import {NgModule} from '@angular/core';
import {ChainsComponent} from './chains.component';
import {ChainsRoutingModule} from './chains-routing.module';
import {SharedModule} from '../shared';
import {DataTablesModule} from 'angular-datatables';
import {NgxResize} from 'ngx-resize';


@NgModule({
  declarations: [ChainsComponent],
  imports: [
    ChainsRoutingModule,
    SharedModule,
    DataTablesModule,
    NgxResize,
  ]
})
export class ChainsModule { }
