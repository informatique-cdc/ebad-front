import {NgModule} from '@angular/core';
import {ManageAccessControlRoutingModule} from './manage-access-control-routing.module';
import {SharedModule} from '../shared';
import {ManageAccessControlComponent} from './manage-access-control.component';
import {IconsModule} from '../icons';
import {NgxPaginationModule} from 'ngx-pagination';

@NgModule({
  declarations: [ManageAccessControlComponent],
  imports: [
    ManageAccessControlRoutingModule,
    SharedModule,
    IconsModule,
    NgxPaginationModule
  ]
})
export class ManageAccessControlModule { }
