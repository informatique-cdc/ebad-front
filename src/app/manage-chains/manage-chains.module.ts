import {NgModule} from '@angular/core';
import {ManageChainsComponent} from './manage-chains.component';
import {SharedModule} from '../shared';
import {ManageChainsRoutingModule} from './manage-chains-routing.module';
import {ModalChainComponent} from './modal-chain/modal-chain.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {IconsModule} from '../icons';
import {ModalChainDeletionComponent} from './modal-chain-deletion/modal-chain-deletion.component';
import {DataTablesModule} from 'angular-datatables';
import {NgxResize} from 'ngx-resize';


@NgModule({
    declarations: [ManageChainsComponent, ModalChainComponent, ModalChainDeletionComponent],
    imports: [
        SharedModule,
        ManageChainsRoutingModule,
        DragDropModule,
        IconsModule,
        DataTablesModule,
        NgxResize,
    ]
})
export class ManageChainsModule { }
